import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bodyParser from "body-parser";
import { open, Database } from "sqlite";
import dotenv from "dotenv"

// Import routers

import exampleRouter from "./routes/example-router";
import cascadeRouter from "./routes/cascade-router";
import { DatabaseController } from "./database-controller";

import adminRouter from "./routes/admin-router";
import { GPTController } from "./gpt-controller";
import { GPTModel } from "./enums";

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable if available, otherwise default to 3000
dotenv.config();dotenv.config();
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
app.use(bodyParser.json());

async function initializeSystem(): Promise<{dbController: DatabaseController, gptController: GPTController}> {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  return {dbController: new DatabaseController(db), gptController: new GPTController(GPTModel.GPT4Turbo)};
}

initializeSystem().then(({dbController, gptController}) => {
  app.use("/", exampleRouter);
  //app.use("/getTable", tableRouter)
  app.use("/api/dataRequest", cascadeRouter(dbController));
  app.use("/api/adminRequest", adminRouter(dbController, gptController));
    //FOR QUICKLY TESTING A PAPER: Uncomment paper to test it. Run "localhost:3000/parse" in a browser to parse the paper and see results in console
    // app.use("/parse", () => {        
    //     gptController.runGPTAnalysis(["./test/testfiles/SEE_in-flight_data_for_two_static_32KB_memories_on_high_earth_orbit.pdf"]);
    //     // gptController.runGPTAnalysis(["./test/testfiles/A_radiation_tolerant_video_camera_for_high_total_dose_environments.pdf"]);
    //     // gptController.runGPTAnalysis(["./test/testfiles/Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf"]);
    //     // gptController.runGPTAnalysis(["./test/testfiles/Solar_flare_proton_environment_for_estimating_downtime_of_spacecraft_CCDs.pdf"]);
    //     // gptController.runGPTAnalysis(["./test/testfiles/slvk121.pdf"]);
    // });

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);

    // Close the database when the app is shutting down
    process.on("exit", () => {
      dbController.closeDB();
      console.log("Database connection closed.");
    });
  });
});
