import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.error(`Error Gettin Example ${error}`)
    }
})



export default router;