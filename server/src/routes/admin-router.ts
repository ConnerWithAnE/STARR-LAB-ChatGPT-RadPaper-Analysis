import express, { Request, Response, Router, NextFunction } from "express";
import { DatabaseController } from "../database-controller";
import { GetQuery, InsertData, RadData, Testing } from "../types";
import axios from "axios";
import jwt from "jsonwebtoken";
import authenticateJWT from "../auth/jwt-auth";

export default function adminRouter(dbController: DatabaseController): Router {
  const router = Router();

  // This takes a data response from the GUI after fixes have been made.
  // The data is in the correct format and ready to be input.

  // THIS WILL NOT WORK WITH RAW PAPERS, Data MUST be in InsertData format
  router.post(
    "/insertPapers",
    authenticateJWT,
    async (req: Request, res: Response) => {
      try {
        await insertRows(requestFromJSON(req.body), dbController).then(() => {
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
    authenticateJWT,
    (req: Request, res: Response) => {
      try {
        // TODO
        parsePapers(req.body).then((result: InsertData[]) => {
          res.send(responseToJSON(result));
        });
      } catch (error) {
        console.error(``);
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

	console.log("hit");
	console.log(ticket);
	console.log(service);
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
      const nsid = casData.user; // Potentally the nsid of the user. Again need to test

	console.log(casData);
	console.log(nsid);
      if (!nsid) {
        res.status(401).json({ error: "Invalid CAS Ticket" });
      }

      if (!allowedNSIDs.includes(nsid)) {
        res.status(403).json({ error: "Access denied" });
      }

      const token = jwt.sign(
        { username: casData.user, roles: casData.roles },
        process.env.JWT_SECRET!,
        { expiresIn: "3h" },
      );

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "CAS validation failed" });
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

async function parsePapers(body: any) {
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
