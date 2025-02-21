import express, { Request, Response, Router, NextFunction } from "express";
import { DatabaseController } from "../db-controller"; // Keep DatabaseController
import { FullDataType } from "../types"; // Use the latest types
import authenticateJWT from "../auth/jwt-auth";

const router = express.Router();

export default function cascadeRouter(
  dbController: DatabaseController,
): Router {
  const router = Router();

  /** Route to get full data */
  router.get("/FullData", async (req: Request, res: Response) => {
    try {
      const data = await dbController.getFullData();
      res.json(data);
    } catch (error) {
      console.error("Error retrieving full data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** Route to get filtered data */
  router.post("/FullData", async (req: Request, res: Response) => {
    try {
      const filters: Partial<FullDataType> = req.body;
      const data = await dbController.getFilteredData(filters);
      res.json(data);
    } catch (error) {
      console.error("Error retrieving filtered data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.post("/Authors", async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Valid name is required" });
        return;
      }
      const { author, created } = await dbController.addAuthor(name);
      res.status(created ? 201 : 200).json(author);
    } catch (error) {
      console.error("Error creating author:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** Route to get an author by ID */
  router.get("/Authors/:id", async (req: Request, res: Response) => {
    try {
      const authorId = parseInt(req.params.id);
      if (isNaN(authorId)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }
      const author = await dbController.getAuthorById(authorId);
      if (!author) {
        res.status(404).json({ error: "Author not found" });
        return;
      }
      res.json(author);
    } catch (error) {
      console.error("Error retrieving author:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** Route to get all authors */
  router.get(
    "/Authors",
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.query.name) {
        return next("route");
      }
      try {
        const authors = await dbController.getAuthors();
        res.json(authors);
      } catch (error) {
        console.error("Error retrieving authors:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  /** Route to get an author by name */
  router.get("/Authors", async (req: Request, res: Response) => {
    try {
      const name = req.query.name as string;
      const author = await dbController.getAuthorByName(name);
      if (!author) {
        res.status(404).json({ error: "Author not found" });
        return;
      }
      res.json(author);
    } catch (error) {
      console.error("Error retrieving author:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** Route to update an author's name */
  router.put("/Authors/:id", async (req: Request, res: Response) => {
    try {
      const authorId = parseInt(req.params.id);
      if (isNaN(authorId)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }
      const { id, ...bodyData } = req.body;
      const updateData = { id: authorId, ...bodyData }; // Ensure URL id takes precedence
      const updatedAuthor = await dbController.updateAuthor(updateData);
      if (!updatedAuthor) {
        res.status(404).json({ error: "Author not found" });
        return;
      }
      res.json(updatedAuthor);
    } catch (error) {
      console.error("Error updating author:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  /** Route to delete an author */
  router.delete("/Authors/:id", async (req: Request, res: Response) => {
    try {
      const authorId = parseInt(req.params.id);
      if (isNaN(authorId)) {
        res.status(400).json({ error: "Invalid ID format" });
        return;
      }

      const deletedCount = await dbController.deleteAuthor(authorId);
      if (deletedCount === 0) {
        res.status(404).json({ error: "Author not found" });
        return;
      }

      res.json({ message: "Author deleted successfully" });
    } catch (error) {
      console.error("Error deleting author:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  return router;
}
