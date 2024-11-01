import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { DataTable } from "./interfaces/database_interface";
import { error } from "console";

class DatabaseController {

    private db: Database<sqlite3.Database, sqlite3.Statement> | undefined; // Define db as a class property

    constructor() {
        this.initDatabase();
    }

    // Initialize the database connection
    private async initDatabase(): Promise<void> {
        this.db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });
    }

    
    async createTable() {
        if (!this.db) {
            throw new Error(`Database not initialized`)
        }
        const query: string = `CREATE TABLE RadiationData(PAPER_NAME TEXT, AUTHOR TEXT, PART_NO TEXT, TYPE TEXT, MANUFACTURER TEXT, TESTING_TYPE TEXT)`;
        this.db.run(query);

    }

    async insertTable() {

    }

    async updateTable() {

    }


}