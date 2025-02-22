import express, { Request, Response, Router, NextFunction } from "express";
import { DatabaseController } from "../db-controller"; // Keep DatabaseController
import { FullDataType } from "../types"; // Use the latest types
import authenticateJWT from "../auth/jwt-auth";
import { GenericController } from "../generic-controller";

const router = express.Router();

export default function cascadeRouter(
  dbController: DatabaseController,
): Router {
  const router = Router();

  // router.post("/bulk", async (req: Request, res: Response) => {
  //   try {
  //     const data = req.body;
  //     console.log("Processing bulk creation...");
  //     const createdInstances = await GenericController.bulkCreate(data);
  //     res.status(201).json(createdInstances);
  //   } catch (error) {
  //     console.error("Error in bulk creation:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });

  /** Create a new record for any model */
  router.post("/:model", async (req: Request, res: Response) => {
    try {
      const modelName = req.params.model;
      const data = req.body;
      const createdInstance = await GenericController.create(modelName, data);

      if (!createdInstance) {
        res.status(400).json({ error: "Invalid data or relationships" });
        return;
      }

      res.status(201).json(createdInstance);
    } catch (error) {
      console.error(`Error creating ${req.params.model}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** 🔹 Get all records for any model */
  router.get("/:model", async (req: Request, res: Response) => {
    try {
      const modelName = req.params.model;
      console.log(`Processing GET request for model: ${modelName}`);

      const records = await GenericController.getAll(modelName);
      res.json(records);
    } catch (error) {
      console.error(`Error retrieving ${req.params.model}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.get("/:model/filter", async (req: Request, res: Response) => {
    try {
      const modelName = req.params.model;
      const filters = req.query; // Extract query parameters

      console.log(`Filtering ${modelName} with`, filters);

      const records = await GenericController.filter(modelName, filters);

      res.json(records);
    } catch (error) {
      console.error(`Error filtering ${req.params.model}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  /** 🔹 Route to get a single record by ID */
  router.get("/:model/:id", async (req: Request, res: Response) => {
    try {
      const modelName = req.params.model;
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }

      const record = await GenericController.getById(modelName, id);

      if (!record) {
        res.status(404).json({ error: "Record not found" });
        return;
      }

      res.json(record);
    } catch (error) {
      console.error(
        `Error retrieving ${req.params.model} with ID ${req.params.id}:`,
        error,
      );
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** 🔹 Update a record by ID for any model */
  router.put("/:model/:id", async (req: Request, res: Response) => {
    try {
      const modelName = req.params.model;
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }

      const data = req.body;
      const append = data.append || false; // Default is `false` (replace mode)
      delete data.append; // Remove `append` flag from request body

      const updatedInstance = await GenericController.update(
        modelName,
        id,
        data,
        append,
      );

      if (!updatedInstance) {
        res.status(404).json({ error: `${modelName} not found` });
        return;
      }

      res.json(updatedInstance);
    } catch (error) {
      console.error(`Error updating ${req.params.model}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** 🔹 Delete a record by ID for any model */
  router.delete("/:model/:id", async (req: Request, res: Response) => {
    try {
      const modelName = req.params.model;
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }

      const deletedCount = await GenericController.delete(modelName, id);

      if (deletedCount === 0) {
        res.status(404).json({ error: `${modelName} not found` });
        return;
      }

      res.json({ message: `${modelName} deleted successfully` });
    } catch (error) {
      console.error(`Error deleting ${req.params.model}:`, error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}
