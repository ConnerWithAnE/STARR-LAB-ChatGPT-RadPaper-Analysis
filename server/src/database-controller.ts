import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { DataTable } from "./interfaces/database-interface";
import { resolve } from "path";
import { rejects } from "assert";
import { GetQuery, TableData, InsertData, UpdateData } from "./types";
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

  // Will probably remove, decided to change id to ROWID to add efficiency
  private async initializeViews(): Promise<void> {
    const paperView = `CREATE VIEW paper_view AS
    SELECT
      ROWID AS id,
      year,
      paper_name,
      part_no,
      type,
      manufacturer,
      data_type,
      testing_location,
      testing_type
    FROM paper`;
    await this.db.run(paperView, (err: any) => {
      if (err) {
        console.error(`Error creating paper view: ${err}`);
      } else {
        console.log("View created successfully.");
      }
    });
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
        const authorRowId = await this.getOrCreateAuthorByName(
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
   * !!! NOTE !!!!
   * paperData MUST contain the ROWID of the paper for proper update purposes.
   *
   * Parameters:
   *  - paperData: Data to be updated coresponding to a sepcific paper
   * Function: Updates an entry for the given paper in the 'paper' table and
   *           entries in the 'author' and 'author_paper_join' are updated.
   * Returns: None
   */
  async updatePaper(paperData: UpdateData): Promise<void> {
    if (!this.db) {
      throw new Error(`Database not initialized`);
    }
    try {
      await this.updatePaperTable(paperData);
      if (paperData.author) {
        await this.syncPaperAuthors(paperData.ROWID, paperData.author);
      }
    } catch (error) {}
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

  private async updatePaperTable(paperData: UpdateData): Promise<void> {
    let query = `UPDATE paper SET `;
    let conditions: string[] = [];
    const params: string[] = [];
    if (!this.db) {
      throw new Error(`Database not initialized`);
    }
    try {
      for (const [key, value] of Object.entries(paperData)) {
        if (
          value !== undefined &&
          value !== null &&
          key !== "author" &&
          key !== "ROWID"
        ) {
          conditions.push(`${key} = ?`);
          params.push(`${value}`);
        }
      }
      params.push(`${paperData.ROWID}`);
      query += `${conditions.join(",")} WHERE ROWID = ?`;
      await this.db.run(query, params);
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
  private async getOrCreateAuthorByName(author: string): Promise<number> {
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
   *  - authors: List of authors given when update is passed
   *  - paperId: Id of the paper to update
   * Function: Compares the new list of authors to the current links, if it is
   *           found that a preexisting link should no longer exist, it is removed.
   *           If a new link is needed, it is created.
   * Returns: None
   */
  private async syncPaperAuthors(
    paperId: number,
    authors: string[],
  ): Promise<void> {
    if (!this.db) {
      throw new Error(`Database not initialized`);
    }

    try {
      // Begin transaction for consistency
      await this.db.exec("BEGIN TRANSACTION");

      // Retrieve the current authors linked to the paper
      const currentAuthors = await this.db.all<
        { author_id: number; name: string }[]
      >(
        `
        SELECT a.name
        FROM paper_author_join paj
        INNER JOIN author a ON paj.author_id = a.ROWID
        WHERE paj.paper_id = ?
        `,
        [paperId],
      );

      // Extract names of current authors
      const currentAuthorNames = currentAuthors.map((author) => author.name);

      // Identify authors to add
      const authorsToAdd = authors.filter(
        (author) => !currentAuthorNames.includes(author),
      );

      // Identify authors to remove
      const authorsToRemove = currentAuthorNames.filter(
        (author) => !authors.includes(author),
      );

      // Add new author links
      for (const authorName of authorsToAdd) {
        // Ensure the author exists in the `author` table
        const row = await this.db.get<{ ROWID: number }>(
          `
          INSERT OR IGNORE INTO author (name) VALUES (?);
          SELECT ROWID FROM author WHERE name = ?;
          `,
          [authorName, authorName],
        );

        if (!row || typeof row.ROWID !== "number") {
          throw new Error(`Failed to retrieve ROWID for author: ${authorName}`);
        }
        // Link the author to the paper using the retrieved ROWID
        await this.db.run(
          `
          INSERT INTO paper_author_join (paper_id, author_id) VALUES (?, ?)
          `,
          [paperId, row.ROWID],
        );
      }

      // Remove unwanted author links
      for (const authorName of authorsToRemove) {
        await this.db.run(
          `
          DELETE FROM paper_author_join
          WHERE paper_id = ?
          AND author_id = (SELECT ROWID FROM author WHERE name = ?)
          `,
          [paperId, authorName],
        );
      }

      // Commit the transaction
      await this.db.exec("COMMIT");
    } catch (error) {
      // Rollback the transaction on error
      await this.db.exec("ROLLBACK");
      console.error(
        `Failed to sync authors for paperID: ${paperId}\nError: ${error}`,
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
        `INSERT INTO paper_author_join (paper_id, author_id)
        SELECT ?, ?
        WHERE NOT EXISTS (
        SELECT 1 FROM paper_author_join WHERE paper_id = ? AND author_id = ?
        )`,
        [paperId, authorId, paperId, authorId],
      );
    } catch (error) {
      console.error(
        `Problem creating paper-author link for authorID: ${authorId}, paperID: ${paperId}\nError: ${error}`,
      );
      throw error;
    }
  }

  /*
   * Parameters:
   *  - authorId: The ROWID of the author to check
   *  - paperId: The ROWID of the paper to checl
   * Function: Checks for the existence of an entry in author_paper_join table.
   *           This
   * Returns: None
   */
  private async checkPaperToAuthorLink(
    authorId: number,
    paperId: number,
  ): Promise<boolean> {
    if (!this.db) {
      throw new Error(`Database not initialized`);
    }
    try {
      const row = await this.db.get(
        "SELECT * FROM paper_author_join WHERE paper_id = ? AND author_id = ?",
        [paperId, authorId],
      );
      return !!row; // Return true if a row is found, otherwise false
    } catch (error) {
      console.error(
        `Problem retrieving paper-author link for authorID: ${authorId}, paperID: ${paperId}\n Error: ${error}`,
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

  async getFullData(search: string): Promise<TableData[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    let query = `
      SELECT 
        p.*,
        GROUP_CONCAT(a.name, ', ') AS author
      FROM 
        paper p
      LEFT JOIN 
        paper_author_join apj ON p.ROWID = apj.paper_id
      LEFT JOIN 
        author a ON apj.author_id = a.ROWID
      WHERE 
        p.paper_name LIKE ?
      GROUP BY
        p.ROWID
    `;

    return new Promise<TableData[]>(async (resolve, reject) => {
      try {
        const result = await this.db.all(query, `${search}%`);
        console.log("Query executed successfully:");

        // Map rows to RadData format
        const radData: TableData[] = result.map((row) => ({
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

  async getFilteredData(queryData: GetQuery): Promise<TableData[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    // Base SELECT query
    let query = `
      SELECT 
        p.*, 
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

    return new Promise<TableData[]>(async (resolve, reject) => {
      try {
        const result = await this.db.all(query, params);
        console.log("Query executed successfully:");

        // Map rows to RadData format
        const radData: TableData[] = result.map((row) => ({
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
