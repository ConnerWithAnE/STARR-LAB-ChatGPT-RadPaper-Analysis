import express, { Request, Response, Router } from "express";
import { DatabaseController } from "../database_controller";

const router = express.Router();
const path = require('path');

export default function postRouter(dbController: DatabaseController): Router {
    
    const router = Router();

    router.post("", (req, res) => {
        try {
            
        } catch (error) {
            console.error(``)
        }
    })
    
    return router;

}

