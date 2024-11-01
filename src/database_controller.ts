import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { DataTable } from "./interfaces/database_interface";


class DatabaseController {

    // Options:
    // '!' after this db to tell typescript to assume it is always defined
    // private db!: Database<...
    // '?' after each this.db which says "hey this might be undefined" upon each run

    // the '!' after db tells typescript to assume it is defined. Checks are performed furhter down
    private db!: Database<sqlite3.Database, sqlite3.Statement>;// | undefined;

    constructor() {
        (async () => {
            this.db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });
        this.initializeTables();
    })();
    }


    /*
     * Parameters: None
     * Function: Creates the table if it does not exist
     * Returns: 
     *   - Promise (void): a void promise, allows for .then()
     * 
     * TODO: This table is incomplete
     */
    private async initializeTables(): Promise<void> {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS RadiationData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paper_name TEXT NOT NULL,
            author TEXT,
            part_no TEXT,
            type TEXT,
            manufacturer TEXT,
            testing_type TEXT
            )
        `);
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
        } catch (err) {
            console.error(
                `Cannot verify if ${tableName} exists or problem creating table.\nError: ${err}`
            )
            throw err;
        }
    }

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
        } catch (err) {
            console.error(
                `Cannot verify if ${tableName} exists or problem with query.\nError: ${err}`
            )
            throw err;
        }
    }

}