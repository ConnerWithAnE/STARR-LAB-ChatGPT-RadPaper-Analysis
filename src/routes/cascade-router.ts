import express, { Request, Response, Router } from "express";
import { DatabaseController } from "../database-controller";
import { GetQuery } from "../types";

const router = express.Router();
const path = require("path");

export default function cascadeRouter(dbController: DatabaseController): Router {
  const router = Router();

  router.post("/tableRequest", (req: Request, res: Response) => {
    try {
      handleRequestBody(req.body);
    } catch (error) {
      console.error(``);
    }
  });

  return router;
}

function handleRequestBody(body: any) {}

function requestFromJSON(body: any) {
  return body as GetQuery;
}

function responseToJSON(body: any) {
  
}
