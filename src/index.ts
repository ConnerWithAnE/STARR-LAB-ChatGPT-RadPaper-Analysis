import express from "express";
import sqlite3 from "sqlite3";
import { open, Database } from 'sqlite';


// Import routers

import exampleRouter from './routes/example_router';


const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable if available, otherwise default to 3000

app.use("/", exampleRouter);





app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})