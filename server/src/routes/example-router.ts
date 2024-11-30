import express, { Request, Response } from "express";

const router = express.Router();
const path = require('path');

router.get("/", (req, res) => {
    try {
        res.sendFile(path.join(__dirname,'./example-router.html'))
    } catch (error) {
        console.error(`Error Gettin Example ${error}`)
    }
})



export default router;