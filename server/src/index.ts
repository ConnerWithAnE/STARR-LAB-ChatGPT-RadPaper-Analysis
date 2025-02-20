import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bodyParser from "body-parser";
import { open, Database } from "sqlite";
import dotenv from "dotenv";

import { initializeDatabase } from "./database-init";

// Import routers

import exampleRouter from "./routes/example-router";
import cascadeRouter from "./routes/cascade-router";
// import { DatabaseController } from "./database-controller";
import { DatabaseController } from "./db-controller";

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
// initializeSystem().then(({ dbController, gptController }) => {
//   app.use("/", exampleRouter);
//   //app.use("/getTable", tableRouter)
//   app.use("/api/dataRequest", cascadeRouter(dbController));
//   //app.use("/api/adminRequest", adminRouter(dbController, gptController));
//   //FOR QUICKLY TESTING A PAPER: Uncomment paper to test it. Run "localhost:3000/parse" in a browser to parse the paper and see results in console
//   // app.use("/parse", () => {
//   //     gptController.runGPTAnalysis(["./test/testfiles/SEE_in-flight_data_for_two_static_32KB_memories_on_high_earth_orbit.pdf"]);
//   //     // gptController.runGPTAnalysis(["./test/testfiles/A_radiation_tolerant_video_camera_for_high_total_dose_environments.pdf"]);
//   //     // gptController.runGPTAnalysis(["./test/testfiles/Radiation_effects_predicted_observed_and_compared_for_spacecraft_systems.pdf"]);
//   //     // gptController.runGPTAnalysis(["./test/testfiles/Solar_flare_proton_environment_for_estimating_downtime_of_spacecraft_CCDs.pdf"]);
//   //     // gptController.runGPTAnalysis(["./test/testfiles/slvk121.pdf"]);
//   // });

//   (async () => {
//     try {
//       await initializeDatabase(); // Call it once
//       console.log("Database initialized successfully.");
//     } catch (error) {
//       console.error("Failed to initialize the database:", error);
//     }
//   })();

//   app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);

//     // Close the database when the app is shutting down
//     process.on("exit", () => {
//       dbController.closeDB();
//       console.log("Database connection closed.");
//     });
//   });
// });

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
    //app.use("/api/adminRequest", adminRouter(dbController, gptController));

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // Handle clean shutdown
    const shutdownHandler = async () => {
      console.log("Shutting down...");
      try {
        await dbController.closeDB();
        console.log("Database connection closed.");
      } catch (error) {
        console.error("Error closing database:", error);
      }
      process.exit(0);
    };

    process.on("exit", shutdownHandler);
    process.on("SIGINT", shutdownHandler);
    process.on("SIGTERM", shutdownHandler);
  });
})();
