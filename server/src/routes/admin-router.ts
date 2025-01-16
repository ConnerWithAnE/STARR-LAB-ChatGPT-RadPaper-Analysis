import express, { Request, Response, Router, NextFunction } from "express";
import { DatabaseController } from "../database-controller";
import { GetQuery, GPTResponse, TableData, RadData, Testing } from "../types";
import axios from "axios";
import jwt from "jsonwebtoken";
import authenticateJWT from "../auth/jwt-auth";
import { GPTController } from "../gpt-controller";
import multer from "multer";
import config from "../config";

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
  dbController: DatabaseController,
  gptController: GPTController,
): Router {
  const router = Router();

  // This takes a data response from the GUI after fixes have been made.
  // The data is in the correct format and ready to be input.

  // THIS WILL NOT WORK WITH RAW PAPERS, Data MUST be in InsertData format
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
    "/parseRequest",
    getAuthMiddleware(),
    upload.array("pdfs"),
    (req: Request, res: Response) => {
          try {
            // TODO
            
            if (config.MockData) {
              import("../../test/testfiles/parse_response.json").then(
                (module) => {
                  res.send(module.default);
                },
              );
            } else {
              parsePapers(req.files, gptController).then(
                (result: GPTResponse[]) => {
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

  router.post(
    "/getFullPapers",
    getAuthMiddleware(), (req: Request, res: Response) => {
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

async function insertRows(
  insertData: TableData[],
  dbcontroller: DatabaseController,
): Promise<void> {
  for (const paper in insertData) {
    await dbcontroller.insertPaper(insertData[paper]);
  }
}

async function parsePapers(
  files: any,
  gptController: GPTController,
): Promise<GPTResponse[]> {
  const fileList: string[] = files.map(
    (file: Express.Multer.File) => file.path,
  );
  console.log(fileList);
  const gptResults = await gptController.runGPTAnalysis(fileList);
  return gptResults;
}

async function getFullPaperRows(
  search: string,
  dbController: DatabaseController,
): Promise<TableData[]> {
  return await dbController.getFullData(search);
}

function insertDataRequestFromJSON(body: any): TableData[] {
  // Ensure body is an array of objects matching the InsertData structure
  if (!Array.isArray(body)) {
    throw new Error("Invalid body format: expected an array.");
  }

  // Return a list of rows to insert
  return body.map((entry) => {
    // Return the validated entry as InsertData
    return { ...entry } as TableData;
  });
}

function responseToJSON(radDataArray: GPTResponse[]): string {
  return JSON.stringify(radDataArray, null, 2); // null and 2 prettify the JSON
}
