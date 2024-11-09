import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import { open, Database } from "sqlite";

// Import routers

import exampleRouter from "./routes/example_router";

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable if available, otherwise default to 3000

/*
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allowed: boolean) => void) => {
    if (origin && /.*\.cascade\.usask\.ca$/.test(origin)) {
      callback(null, true); // Allow requests from matching domains
    } else {
      callback(new Error('Not allowed by CORS'), false); // Reject requests from other domains
    }
  }
};
*/

const corsOptions = {
  origin: '*',  // Allow all origins
};

app.use(cors(corsOptions));
app.use("/", exampleRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
