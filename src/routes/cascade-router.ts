import express, { Request, Response, Router } from "express";
import { DatabaseController } from "../database-controller";
import { GetQuery, RadData, Testing } from "../types";

const router = express.Router();

export default function cascadeRouter(
  dbController: DatabaseController,
): Router {
  const router = Router();

  router.post("/tableRequest", (req: Request, res: Response) => {
    try {
      getFilteredRows(requestFromJSON(req.body), dbController).then(
        (result: RadData[]) => {
          res.send(responseToJSON(result));
        },
      );
    } catch (error) {
      console.error(``);
    }
  });

  return router;
}

function getFilteredRows(
  getData: GetQuery,
  dbcontroller: DatabaseController,
): Promise<RadData[]> {
  return dbcontroller.getData(getData);
}

function requestFromJSON(body: any) {
  return body as GetQuery;
}

function responseToJSON(radDataArray: RadData[]): string {
  return JSON.stringify(radDataArray, null, 2); // null and 2 prettify the JSON
}
