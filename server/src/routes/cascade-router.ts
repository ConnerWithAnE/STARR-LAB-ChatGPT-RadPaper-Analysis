import express, { Request, Response, Router, NextFunction } from "express";
//import { DatabaseController } from "../db-controller"; // Keep DatabaseController
import { FullDataType } from "../types"; // Use the latest types
import authenticateJWT from "../auth/jwt-auth";
import { GenericController } from "../generic-controller";

const router = express.Router();

export default function cascadeRouter(dbController: GenericController): Router {
  const router = Router();

  router.get("/papers/filter", async (req: Request, res: Response) => {
    try {
      const modelName = req.params.model;
      const filters = req.query; // Extract query parameters

      console.log(`Filtering ${modelName} with`, filters);

      const records = await GenericController.cascade_filter("papers", filters);

      if (!Array.isArray(records) && "error" in records) {
        res.status(records.status || 500).json({ error: records.error });
        return;
      }

      res.json(records);
    } catch (error) {
      console.error(`Error filtering ${req.params.model}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}
