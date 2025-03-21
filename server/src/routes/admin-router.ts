import express, { Request, Response, Router, NextFunction } from "express";
import { DatabaseController } from "../database-controller";
import {
  ai_FullDataType,
  ai_GPTResponse,
  GetQuery,
  GPTResponse,
  Testing,
} from "../types";
import axios from "axios";
import jwt from "jsonwebtoken";
import authenticateJWT from "../auth/jwt-auth";
import { GPTController } from "../gpt-controller";
import multer from "multer";
import config from "../config";
import { GenericController } from "../generic-controller";

// Set up custom storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where the files will be stored
    cb(null, "pdfData/papers");
  },
  filename: (req, file, cb) => {
    // Set the file name to the original name
    cb(null, file.originalname); // This ensures the file is saved with the original name
  },
});

const router = express.Router();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}); // 10mb limit

function getAuthMiddleware() {
  if (config.AuthEnable) {
    return authenticateJWT;
  }
  return (req: Request, res: Response, next: Function) => next();
}

export default function adminRouter(
  dbController: GenericController,
  gptController: GPTController,
): Router {
  const router = Router();

  // This takes a data response from the GUI after fixes have been made.
  // The data is in the correct format and ready to be input.

  // THIS WILL NOT WORK WITH RAW PAPERS, Data MUST be in InsertData format
  /*
  router.post(
    "/insertPapers",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        await insertRows(
          insertDataRequestFromJSON(req.body),
          dbController,
        ).then(() => {
          // 201: The request was successful, and a new resource was created
          res.send(201);
        });
      } catch (error) {
        console.error(`${error}`);
      }
    },
  );
  

  
  router.post(
    "/updatePaper",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        await dbController.updatePaper(req.body as UpdateData)
      } catch (error) {
        console.error(`${error}`);
      }
    }
  );
  */

  router.post(
    "/parseRequest",
    getAuthMiddleware(),
    upload.array("pdfs"),
    async (req: Request, res: Response) => {
      try {
        if(!config.MockData && (req.files === undefined || req.files.length === 0)) {
          res.status(400).send({
            message: "No files uploaded."
          });
          return;
        }
        else if (config.MockData) {
          import("../../test/testfiles/parse_response.json").then((module) => {
            console.log("Sending mock data...");
            res.send(module.default);
          });
        } 
        else {
          await parsePapers(req.files, gptController).then(
            (result: ai_GPTResponse[]) => {
              console.log(responseToJSON(result));
              res.send(responseToJSON(result));
            },
          );
        }
      } catch (error) {
        console.error(`${error}`);
      }
    },
  );
  /*

  router.post(
    "/getFullPapers",
    getAuthMiddleware(),
    (req: Request, res: Response) => {
      try {
        // More intricate searches can be employed later similar to the table filter
        getFullPaperRows(req.body.search, dbController).then(
          (result: TableData[]) => {
            res.send(JSON.stringify(result, null, 2));
          },
        );
      } catch (error) {
        console.error(`${error}`);
      }
    },
  );
  */

  /** Create a new record for any model */
  router.post(
    "/:model",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const modelName = req.params.model;
        const data = req.body;
        delete data.id;

        const createdInstance = await GenericController.create(modelName, data);

        if (!Array.isArray(createdInstance) && "error" in createdInstance) {
          res
            .status(createdInstance.status || 400)
            .json({ error: createdInstance.error });
          return;
        }

        res.status(201).json(createdInstance);
      } catch (error) {
        console.error(`Error creating ${req.params.model}:`, error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  router.post(
    "/papers/full",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const data = req.body;
        console.log("Received request for full paper creation:", data);

        // Check if the request contains multiple papers
        if (Array.isArray(data)) {
          console.log(`Processing multiple papers: ${data.length} entries.`);

          const failedPapers = [];
          for (const paper of data) {
            try {
              const createdPaper = await GenericController.createFullPaper(
                paper,
              );
              if (createdPaper.error) {
                failedPapers.push({ paper, error: createdPaper.error });
              }
            } catch (err) {
              console.error(
                `Error processing paper: ${paper.name || "Unknown"}`,
                err,
              );
              failedPapers.push({ paper, error: "Internal Server Error" });
            }
          }

          // If all papers succeeded, return an empty array
          if (failedPapers.length === 0) {
            res.status(201).json([]);
            return;
          }

          // Return only failed papers
          res.status(207).json(failedPapers);
          return;
        }

        // If a single paper, process as usual
        const createdPaper = await GenericController.createFullPaper(data);

        if (createdPaper.error) {
          res
            .status(createdPaper.status || 500)
            .json({ error: createdPaper.error });
        }

        res.status(201).json(createdPaper);
      } catch (error) {
        console.error("Error creating full paper:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  router.put(
    "/papers/full/:id",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
          res.status(400).json({ error: "Invalid ID format" });
          return;
        }

        const data = req.body;
        const append = data.append;
        delete data.append; // Remove append flag from request body

        console.log(
          `Received request to update paper ID ${id} with append=${append}`,
        );
        const updatedPaper = await GenericController.updateFullPaper(
          id,
          data,
          append,
        );

        if (updatedPaper.error) {
          res
            .status(updatedPaper.status || 500)
            .json({ error: updatedPaper.error });
        } else {
          res.json(updatedPaper);
        }
      } catch (error) {
        console.error("Error updating full paper:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  router.get(
    "/papers/full",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        console.log("Received request to fetch all full papers.");
        const papers = await GenericController.getFullPaper();

        res.json(papers);
      } catch (error) {
        console.error("Error fetching all full papers:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  router.get(
    "/papers/full/:id",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
          res.status(400).json({ error: "Invalid paper ID format" });
          return;
        }

        console.log(`Received request to fetch full paper with ID: ${id}`);
        const paper = await GenericController.getFullPaperById(id);

        if (paper.error) {
          res.status(paper.status || 500).json({ error: paper.error });
          return;
        }

        res.json(paper);
      } catch (error) {
        console.error("Error fetching full paper:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  /** Get all records for any model */
  router.get(
    "/:model",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const modelName = req.params.model;
        console.log(`Processing GET request for model: ${modelName}`);

        const records = await GenericController.getAll(modelName);

        if (!Array.isArray(records) && "error" in records) {
          res.status(records.status || 500).json({ error: records.error });
          return;
        }

        res.json(records);
      } catch (error) {
        console.error(`Error retrieving ${req.params.model}:`, error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  router.get(
    "/:model/filter",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const modelName = req.params.model;
        const filters = req.query; // Extract query parameters

        console.log(`Filtering ${modelName} with`, filters);

        const records = await GenericController.filter(modelName, filters);

        if (!Array.isArray(records) && "error" in records) {
          res.status(records.status || 500).json({ error: records.error });
          return;
        }

        res.json(records);
      } catch (error) {
        console.error(`Error filtering ${req.params.model}:`, error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );
  /**  Route to get a single record by ID */
  router.get(
    "/:model/:id",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
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

        if (record.error) {
          res.status(record.status || 500).json({ error: record.error });
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
    },
  );

  /**  Update a record by ID for any model */
  router.put(
    "/:model/:id",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
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
        delete data.id;

        const updatedInstance = await GenericController.update(
          modelName,
          id,
          data,
          append,
        );

        if (updatedInstance.error) {
          res
            .status(updatedInstance.status || 500)
            .json({ error: updatedInstance.error });
          return;
        }

        res.json(updatedInstance);
      } catch (error) {
        console.error(`Error updating ${req.params.model}:`, error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  /**  Delete a record by ID for any model */
  router.delete(
    "/:model/:id",
    getAuthMiddleware(),
    async (req: Request, res: Response) => {
      try {
        const modelName = req.params.model;
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
          res.status(400).json({ error: "Invalid ID format" });
          return;
        }

        const deletedCount = await GenericController.delete(modelName, id);

        if (deletedCount === 0) {
          res
            .status(404)
            .json({ error: `No record found with ID ${id} in ${modelName}` });
          return;
        } else if (deletedCount === -1) {
          res.status(400).json({ error: `Invalid model name: ${modelName}` });
          return;
        }

        res.json({ message: `${modelName} deleted successfully` });
      } catch (error) {
        console.error(`Error deleting ${req.params.model}:`, error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    },
  );

  // Example list of allowed NSIDs (replace with database table in the future)
  const allowedNSIDs = [
    "mrm322",
    "nec314",
    "stm875",
    "cmh860",
    "ara258",
    "xgr074",
  ];

  router.get("/auth/cas-validate", async (req: Request, res: Response) => {
    const { ticket, service } = req.query;

    if (!ticket || !service) {
      res.status(400).json({ error: "Missing ticket or service" });
    }

    try {
      // Validate CAS ticket
      const casResponse = await axios.get(
        `https://cas.usask.ca/cas/serviceValidate`,
        {
          params: { ticket, service },
        },
      );

      const casData = casResponse.data; // assumed user CAS info, need to test to see
      if (casData.includes("<cas:authenticationSuccess>")) {
        const nsid = casData.match(/<cas:user>(.*?)<\/cas:user>/)[1];
        console.log(`User logged in with nsid: ${nsid}`);
        if (!nsid) {
          res.status(401).json({ error: "Invalid CAS Ticket" });
        }

        if (!allowedNSIDs.includes(nsid)) {
          console.log(`User attempted to login with nsid: ${nsid}`);
          res.status(403).json({ error: "Access denied" });
        }
        const token = jwt.sign({ username: nsid }, process.env.JWT_SECRET!, {
          expiresIn: "3h",
        });
        res.json({ token: token, nsid: nsid });
      } else {
        res.status(401).json({ error: "CAS authentication failed" });
      }
    } catch (error) {
      res.status(500).json({ error: "CAS validation failed" });
    }
  });

  return router;
}

/*
async function insertRows(
  insertData: InsertData[],
  dbcontroller: DatabaseController,
): Promise<void> {
  for (const paper in insertData) {
    await dbcontroller.insertPaper(insertData[paper]);
  }
}
  */

async function parsePapers(
  files: any,
  gptController: GPTController,
): Promise<any[]> {
  const fileList: string[] = files.map(
    (file: Express.Multer.File) => file.path,
  );
  console.log(fileList);
  const gptResults = await gptController.processRadiationPapers(fileList);
  return gptResults;
}

/*
async function getFullPaperRows(
  search: string,
  dbController: DatabaseController,
): Promise<TableData[]> {
  return await dbController.getFullData(search);
}
  */

function insertDataRequestFromJSON(body: any): ai_FullDataType[] {
  // Ensure body is an array of objects matching the InsertData structure
  if (!Array.isArray(body)) {
    throw new Error("Invalid body format: expected an array.");
  }

  // Return a list of rows to insert
  return body.map((entry) => {
    // Return the validated entry as InsertData
    return { ...entry } as ai_FullDataType;
  });
}

function responseToJSON(radDataArray: ai_GPTResponse[]): string {
  return JSON.stringify(radDataArray, null, 2); // null and 2 prettify the JSON
}
