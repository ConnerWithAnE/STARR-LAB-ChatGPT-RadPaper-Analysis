import express, { Request, Response, Router } from "express";
import { DatabaseController } from "../database-controller";
import { GetQuery, RadData, Testing } from "../types";
import authenticateJWT from "../auth/jwt-auth";


const router = express.Router();

export default function cascadeRouter(
  dbController: DatabaseController,
): Router {
  const router = Router();

  // Test!!! TO BE REMOVED THIS SHOULD NOT BE HERE
  router.get("/", (req: Request, res: Response) => {
    dbController.insertPaper({
      paper_name: "Radiation Test Effects On Tested Radiation",
      year: 2023,
      author: ["John Jacob", "Lin Lee", "Dr. Joan Gooding"],
      part_no: "LT3094EMSE#PBF",
      type: "Low Dropout Voltage Regulator",
      manufacturer: "Analog Devices",
      testing_location: "Terrestrial",
      testing_type: "SEE",
      data_type: 0,
    });
    console.log("Sucess");
  });

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
