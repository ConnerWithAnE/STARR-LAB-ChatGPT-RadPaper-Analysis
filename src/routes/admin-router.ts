import express, { Request, Response, Router } from "express";
import { DatabaseController } from "../database-controller";
import { GetQuery, InsertData, RadData, Testing } from "../types";

const router = express.Router();

export default function adminRouter(dbController: DatabaseController): Router {
  const router = Router();

  // This takes a data response from the GUI after fixes have been made.
  // The data is in the correct format and ready to be input.

  // THIS WILL NOT WORK WITH RAW PAPERS, Data MUST be in InsertData format
  router.post("/insertPapers", (req: Request, res: Response) => {
    try {
      insertRows(requestFromJSON(req.body), dbController).then(() => {
        // 201: The request was successful, and a new resource was created
        res.send(201);
      });
    } catch (error) {
      console.error(`${error}`);
    }
  });

  router.post("/parseRequest", (req: Request, res: Response) => {
    try {
      // TODO
      parsePapers().then((result: InsertData[]) => {
        res.send(responseToJSON(result));
      });
    } catch (error) {
      console.error(``);
    }
  });

  return router;
}

async function insertRows(
  insertData: InsertData[],
  dbcontroller: DatabaseController,
): Promise<void> {
  for (const paper in insertData) {
    await dbcontroller.insertPaper(insertData[paper]);
  }
}

async function parsePapers() {
  const temp: InsertData[] = [];
  return temp;
}

function requestFromJSON(body: any): InsertData[] {
  // Ensure body is an array of objects matching the InsertData structure
  if (!Array.isArray(body)) {
    throw new Error("Invalid body format: expected an array.");
  }

  // Return a list of rows to insert
  return body.map((entry) => {
    // Return the validated entry as InsertData
    return { ...entry } as InsertData;
  });
}

function responseToJSON(radDataArray: RadData[]): string {
  return JSON.stringify(radDataArray, null, 2); // null and 2 prettify the JSON
}
