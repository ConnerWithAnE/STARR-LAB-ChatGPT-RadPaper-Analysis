import express, { Request, Response, Router } from "express";
import { DatabaseController } from "../db-controller"; // Keep DatabaseController
import { FullDataType } from "../types"; // Use the latest types
import authenticateJWT from "../auth/jwt-auth";

const router = express.Router();

export default function cascadeRouter(
  dbController: DatabaseController,
): Router {
  const router = Router();

  /** Route to get full data */
  router.get("/getFullData", async (req: Request, res: Response) => {
    try {
      const data = await dbController.getFullData();
      res.json(data);
    } catch (error) {
      console.error("Error retrieving full data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** Route to get filtered data */
  router.post("/getFilteredData", async (req: Request, res: Response) => {
    try {
      const filters: Partial<FullDataType> = req.body;
      const data = await dbController.getFilteredData(filters);
      res.json(data);
    } catch (error) {
      console.error("Error retrieving filtered data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}
