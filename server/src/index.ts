import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bodyParser from "body-parser";
import { open, Database } from "sqlite";
import dotenv from "dotenv";
import fs from "fs";

import { initializeDatabase } from "./database-init";

// Import routers

import exampleRouter from "./routes/example-router";
import cascadeRouter from "./routes/cascade-router";
// import { DatabaseController } from "./database-controller";
//import { DatabaseController } from "./db-controller";
import { GenericController as DatabaseController } from "./generic-controller";

import adminRouter from "./routes/admin-router";
import { GPTController } from "./gpt-controller";
import { GPTModel } from "./enums";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable if available, otherwise default to 3000
/* In the future this will be used to ensure that only requests from certain domains are accepted
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
  origin: "*", // Allow all origins
};

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

async function initializeSystem(): Promise<{
  dbController: DatabaseController;
  gptController: GPTController;
}> {
  return {
    dbController: new DatabaseController(),
    gptController: new GPTController(GPTModel.GPT4Turbo),
  };
}

(async () => {
  try {
    await initializeDatabase();
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize the database:", error);
  }

  initializeSystem().then(({ dbController, gptController }) => {
    app.use("/", exampleRouter);
    app.use("/api/dataRequest", cascadeRouter(dbController));
    app.use("/api/adminRequest", adminRouter(dbController, gptController));

    //for testing

    /*
    app.get("/test2-gpt", async (req, res) => {
      try {
        const pdfFile = ["./test/Review_of_TID_Effects_Reported_in_ProASIC3_and_ProASIC3L_FPGAs_for_3D_PLUS_Camera_Heads.pdf"];
        const pdfFiles = [
          "./test/Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf",
          "./test/SEE_in-flight_data_for_two_static_32KB_memories_on_high_earth_orbit.pdf",
          "./test/Single-Event_Effects_Measurements_on_COTS_Electronic_Devices_for_Use_on_NASA_Mars_Missions.pdf",
          "./test/Review_of_TID_Effects_Reported_in_ProASIC3_and_ProASIC3L_FPGAs_for_3D_PLUS_Camera_Heads.pdf",
        ];
        const gptController = new GPTController(GPTModel.GPT4O);
        console.log("Running GPT Analysis...");
        const results = await gptController.processRadiationPapers(pdfFile);

        fs.writeFileSync(
              "./test/1-paper-output-hope.json",
              JSON.stringify(results, null, 4),
            );

        console.log("GPT Analysis Results:", results);
        res.json(results);
      } catch (error) {
        console.error("Error during GPT analysis:", error);
        res.status(500).json({ error: "GPT analysis failed", details: error });
      }
    });
    */

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);

      // Close the database when the app is shutting down
      process.on("exit", () => {
        dbController.closeDB();
        console.log("Database connection closed.");
      });
    });
  });
})();
