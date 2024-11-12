import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { DataTable } from "./interfaces/database-interface";
import { resolve } from "path";
import { rejects } from "assert";
import { getQuery, insertData, RadData } from "./types";


export class DatabaseController {

    // Options:
    // '!' after this db to tell typescript to assume it is always defined
    // private db!: Database<...
    // '?' after each this.db which says "hey this might be undefined" upon each run

    // the '!' after db tells typescript to assume it is defined. Checks are performed furhter down
    private db: Database<sqlite3.Database, sqlite3.Statement>;// | undefined;

    constructor(db: Database<sqlite3.Database, sqlite3.Statement>) {
        this.db = db;
    }

    async closeDB(): Promise<void> {
        this.db.close();
        console.log(`DB Successfully Closed`);
    }

    /*
     * Parameters: None
     * Function: Creates the table if it does not exist
     *      ROWID: This is an auto added param
     *             unique and auto incremented.
     * Returns: 
     *   - Promise (void): a void promise, allows for .then()
     * 
     * TODO: This table is incomplete
     */
    private async initializeTables(): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS paper (
                ROWID INTEGER PRIMARY KEY AUTOINCREMENT
                year INTEGER,
                paper_name TEXT NOT NULL,
                part_no TEXT,
                type TEXT,
                manufacturer TEXT,
                data_type INTEGER,

                testing_type TEXT
            )
        `);

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS author (
                ROWID INTEGER PRIMARY KEY AUTOINCREMENT
                name TEXT NOT NULL UNIQUE,
            )
        `)

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS paper_author_join (
                paper_id INTEGER NOT NULL,
                author_id INTEGER NOT NULL
            )     
        `)
    }

    /*
     * Parameters:
     *  - tableName (string): the name of the table to check
     * Function: Checks for the existance of a given table in the database
     * Returns:
     *  - boolean:
     *      - true: table exists
     *      - false: table does not exist
     */
    async tableExists(tableName: string): Promise<boolean> {
        // Check the sqlite master and see if the given table exists
        return new Promise((resolve, reject) => {
            const query = `SELECT name FROM sqlite_master WHERE type='table' AND name=?;`;
            this.db.get(query, [tableName], (err: any, row: undefined) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined);
                }
            })
        })
    }
       

    /*
     * Parameters:
     *  - paperData: An insertData instance
     * Function: Creates an entry for the given paper in the 'paper' table and
     *           entries in the 'author' table for each author. An entry is then
     *           created in the 'author_paper_join' table for each author.
     * Returns: None
     */
    async insertPaper(
        paperData: insertData
    ): Promise<void> {
        if(!this.db) {
            throw new Error(`Database not initialized`);
        }
        try {
            const paperId = await this.createPaper(paperData)

            for (const author in paperData.author) {
                const authorRowId = await this.getOrCreateAuthor(author);
                await this.linkPaperToAuthor(authorRowId, paperId);
            }
        } catch(error) {
            console.error(`Issue inserting paper: ${paperData.paper_name}\nError: ${error}`)
            throw error;
        }
    }

    /*
     * Parameters:
     *  - paperData: An insertData instance
     * Function: Uses the given data to create an entry in the table cotaining the papers
     * Returns:
     *  - number: The ROWID of the paper.
     */
    private async createPaper(
        paperData: insertData
    ): Promise<number> {
        if(!this.db) {
            throw new Error(`Database not initialized`)
        }
        try {
            // TODO: finish adding all values for paper creation
            await this.db.run(`
                INSERT INTO paper (
                year
                paper_name) VALUES (?, ?)
            `, [paperData.year, paperData.paper_name])
            const row = await this.db.get(`SELECT last_insert_rowid() as ROWID`);
            return row.ROWID;
        } catch(error) {
            console.error(error);
            throw error;
        }
    }

    /*
     * Parameters:
     *  - author: the name of the author to be added/retrieved
     * Function: Checks if an author exists in the table, if it does return the ROWID.
     *           If not create a new entry and return the ROWID. 
     * Returns:
     *  - number: The ROWID of the author.
     */
    private async getOrCreateAuthor(
        author: string,
    ): Promise<number> {
        if(!this.db) {
            throw new Error(`Database not initialized`)
        }
        try {
            const row = await this.db.get('SELECT ROWID FROM author WHERE name = ?', [author]);
            if (row) {
                return row.ROWID;
            } else {
                await this.db.run('INSERT INTO author (name) VALUES (?)', [author]);
                const result = await this.db.get('SELECT last_insert_rowid() as ROWID');
                return result.ROWID;
            }
        } catch(error) {
            console.error(`Problem creating or getting author: ${author}\nError: ${error}`)
            throw error;
        }
    }

    /*
     * Parameters:
     *  - authorId: The ROWID of the author to link
     *  - paperId: The ROWID of the paper to link
     * Function: Creates an entry in the author_paper_join table.
     *           This links the paper and author together, allowing for
     *           easy query of authors of specific papers
     * Returns: None
     */
    private async linkPaperToAuthor(
        authorId: number,
        paperId: number
    ): Promise<void> {
        try {
            await this.db.run('INSERT INTO author_paper_join (paper_id, author_id) VALUES (?, ?)', [paperId, authorId])
        } catch (error) {
            console.error(`Problem creating paper-author link for authorID: ${authorId}, paperID: ${paperId}\nError: ${error}`)
            throw error;
        }
    }

    /*
     * Parameters: None
     * Function: Gets the total number of papers in the table 'paper'
     * Returns:
     *  - number: Total number of papers
     */
    async getNumberOfPapers(): Promise<number> {
        try {
            const numPapers = await this.db.get("SELECT COUNT(*) FROM paper");
            return numPapers;
        } catch (error) {
            console.error(`Problem getting the number of papers`);
            throw error;
        }
    }

    /*
     * Parameters: None
     * Function: Gets the total number of authors in the table 'author'
     * Returns:
     *  - number: Total number of authors
     */
    async getNumberOfAuthors(): Promise<number> {
        try {
            const numAuthors = await this.db.get("SELECT COUNT(*) FROM author");
            return numAuthors;
        } catch (error) {
            console.error(`Problem getting the number of authors`);
            throw error;
        }
    }


    async getData(
        queryData: getQuery
    ): Promise<RadData[]> {
        if (!this.db) {
            throw new Error(`Database not initialized`);
        }

        let query = `SELECT * FROM RadiationData WHERE `;
        const conditions: string[] = [];

        // Build WHERE conditions
        for (const [key, value] of Object.entries(queryData)) {
            if (value != undefined) {
                if (Array.isArray(value)) {
                    // Multiple values should be combined with OR and LIKE
                    const formattedArray = value.map(val => `'%${val}%'`).join(', ');
                    conditions.push(`${key} LIKE ANY (array[%${formattedArray}])`);
                } else {
                    // Single value with LIKE
                    conditions.push(`${key} LIKE '%${value}'`);
                }
            }
        }

        // Join conditions with AND
        query += conditions.join(' AND ');

        try {
            return new Promise<any>((resolve, reject) => {
                this.db.all(query, (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject('Could not complete query')
                    } else {
                        console.log(rows);
                        const radData: RadData[] = rows.map((row) => ({
                            paper_name: row.paper_name,
                            author: row.author,
                            part_no: row.part_no,
                            type: row.type,
                            manufacturer: row.manufacturer,
                            testing_type: row.testing_type
                        }))
                        resolve(radData);
                    }
                })
            })
        } catch (error) {
            console.error(`Unable to get data from db.\nError: ${error}`)
            throw error;
        }
    }

     /*
     * Parameters:
     *  - tableName (string): the name of the new table to create
     *  - query (string): the query to run on the database
     * Function: Creates a new table within the database
     * Returns: None
     * 
     * !!Potentially Uneeded Function!!
     * 
     */
     async createTable(
        tableName: string,
        query: string
    ) {
        if (!this.db) {
            throw new Error(`Database not initialized`)
        }
        try {
            const exists = await this.tableExists(tableName);
            if (!exists) {
                return new Promise<void>((resolve, reject) => {
                    this.db.run(query, (err: any) => {
                        if (err) {
                            reject(`Could not create table: ${err}`)
                        } else {
                            resolve();
                        }
                    })
                })

            }
        } catch (error) {
            console.error(
                `Cannot verify if ${tableName} exists or problem creating table.\nError: ${error}`
            )
            throw error;
        }
    }

    /*
     * !!Uneeded function, to be removed!!
     */
    async runQuery(
        tableName: string,
        query: string) {
        if (!this.db) {
            throw new Error(`Database not initialized`)
        }
        try {
            const exists = await this.tableExists(tableName);
            if (exists) {
                return new Promise<void>((resolve, reject) => {
                    this.db.run(query, (err: any) => {
                        if (err) {
                            reject(`Could not complete query: ${err}`)
                        } else {
                            resolve();
                        }
                    })
                })

            }
        } catch (error) {
            console.error(
                `Cannot verify if ${tableName} exists or problem with query.\nError: ${error}`
            )
            throw error;
        }
    }

}