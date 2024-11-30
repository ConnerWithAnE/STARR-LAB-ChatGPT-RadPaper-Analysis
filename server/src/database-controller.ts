import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { DataTable } from "./interfaces/database-interface";
import { resolve } from "path";
import { rejects } from "assert";
import { GetQuery, InsertData, RadData } from "./types";
import { error } from "console";

export class DatabaseController {
  // Options:
  // '!' after this db to tell typescript to assume it is always defined
  // private db!: Database<...
  // '?' after each this.db which says "hey this might be undefined" upon each run

  // the '!' after db tells typescript to assume it is defined. Checks are performed furhter down
  private db: Database<sqlite3.Database, sqlite3.Statement>; // | undefined;

  constructor(db: Database<sqlite3.Database, sqlite3.Statement>) {
    this.db = db;
    // Initialize tables and handle errors
    this.initializeTables()
      .then(() => console.log("Tables initialized successfully"))
      .catch((err) => console.error("Failed to initialize tables", err));
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
                ROWID INTEGER PRIMARY KEY AUTOINCREMENT,
                year INTEGER,
                paper_name TEXT NOT NULL,
                part_no TEXT,
                type TEXT,
                manufacturer TEXT,
                data_type INTEGER,
                testing_location TEXT,
                testing_type TEXT
            )
        `);

    await this.db.exec(`
            CREATE TABLE IF NOT EXISTS author (
                ROWID INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        `);

    await this.db.exec(`
            CREATE TABLE IF NOT EXISTS paper_author_join (
                paper_id INTEGER NOT NULL,
                author_id INTEGER NOT NULL
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
      });
    });
  }

  /*
   * Parameters:
   *  - paperData: An insertData instance
   * Function: Creates an entry for the given paper in the 'paper' table and
   *           entries in the 'author' table for each author. An entry is then
   *           created in the 'author_paper_join' table for each author.
   * Returns: None
   */
  async insertPaper(paperData: InsertData): Promise<void> {
    if (!this.db) {
      throw new Error(`Database not initialized`);
    }
    try {
      const paperId = await this.createPaper(paperData);
      console.log(paperData.author);
      for (const author in paperData.author) {
        const authorRowId = await this.getOrCreateAuthor(
          paperData.author[author],
        );
        await this.linkPaperToAuthor(authorRowId, paperId);
      }
    } catch (error) {
      console.error(
        `Issue inserting paper: ${paperData.paper_name}\nError: ${error}`,
      );
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
  private async createPaper(paperData: InsertData): Promise<number> {
    if (!this.db) {
      throw new Error(`Database not initialized`);
    }
    try {
      // TODO: finish adding all values for paper creation
      await this.db.run(
        `
                INSERT INTO paper (
                year,
                paper_name,
                part_no,
                type,
                manufacturer,
                data_type,
                testing_location,
                testing_type
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
        [
          paperData.year,
          paperData.paper_name,
          paperData.part_no,
          paperData.type,
          paperData.manufacturer,
          paperData.data_type,
          paperData.testing_location,
          paperData.testing_type,
        ],
      );
      const row = await this.db.get(`SELECT last_insert_rowid() as ROWID`);
      return row.ROWID;
    } catch (error) {
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
  private async getOrCreateAuthor(author: string): Promise<number> {
    if (!this.db) {
      throw new Error(`Database not initialized`);
    }
    try {
      const row = await this.db.get("SELECT ROWID FROM author WHERE name = ?", [
        author,
      ]);
      if (row) {
        return row.ROWID;
      } else {
        console.log(author);
        await this.db.run("INSERT INTO author (name) VALUES (?)", [author]);
        const result = await this.db.get("SELECT last_insert_rowid() as ROWID");
        return result.ROWID;
      }
    } catch (error) {
      console.error(
        `Problem creating or getting author: ${author}\nError: ${error}`,
      );
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
    paperId: number,
  ): Promise<void> {
    try {
      await this.db.run(
        "INSERT INTO paper_author_join (paper_id, author_id) VALUES (?, ?)",
        [paperId, authorId],
      );
    } catch (error) {
      console.error(
        `Problem creating paper-author link for authorID: ${authorId}, paperID: ${paperId}\nError: ${error}`,
      );
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

  async getData(queryData: GetQuery): Promise<RadData[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    // Base SELECT query
    let query = `
      SELECT 
        p.year, 
        p.paper_name, 
        p.part_no, 
        p.type, 
        p.manufacturer, 
        p.data_type, 
        p.testing_location, 
        p.testing_type,  
        GROUP_CONCAT(a.name, ', ') AS author
      FROM 
        paper p
      LEFT JOIN 
        paper_author_join apj ON p.ROWID = apj.paper_id
      LEFT JOIN 
        author a ON apj.author_id = a.ROWID
    `;

    const conditions: string[] = [];
    const params: any[] = [];

    // Build WHERE conditions based on queryData
    for (const [key, value] of Object.entries(queryData)) {
      if (value !== undefined && value !== null) {
        if (key === "author") {
          // Ensure author filters don't exclude other authors in the GROUP_CONCAT
          conditions.push(`EXISTS (
            SELECT 1 
            FROM paper_author_join apj2 
            JOIN author a2 ON apj2.author_id = a2.ROWID 
            WHERE apj2.paper_id = p.ROWID 
            AND a2.name LIKE ? 
          )`);
          params.push(`${value}%`);
        } else {
          conditions.push(`p.${key} LIKE ?`);
          params.push(`${value}%`);
        }
      }
    }

    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add GROUP BY for GROUP_CONCAT
    query += ` GROUP BY p.ROWID`;

    console.log(query);

    return new Promise<RadData[]>(async (resolve, reject) => {
      try {
        const result = await this.db.all(query, params);
        console.log("Query executed successfully:");

        // Map rows to RadData format
        const radData: RadData[] = result.map((row) => ({
          ...row,
          author: row.author ? row.author.split(", ") : [],
        }));

        resolve(radData);
      } catch (error) {
        console.error("Error getting data", error);
        throw error;
      }
    });
  }
}
