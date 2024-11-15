import bodyParser from "body-parser";
// import cors from "cors";
import { Request, Response } from "express";

const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

app.use(express.json());
app.use(express.static('public')); // To serve static files

router.get('/test', (req, res) => {
  res.send("Test endpoint is working!");
});

// Endpoint to handle PDF uploads
router.post('/', upload.array('pdfs'), async (req, res) => {
  console.log('hi');
  const files = req.files;
  console.log(files);
  let results = [];

  for (const file of files) {
    const filePath = path.join(__dirname, file.path);
    console.log(filePath)
    
    // const dataBuffer = fs.readFileSync(filePath);

    try {
      const dataBuffer = await fs.readFile(filePath);
      if (dataBuffer) {
        console.log(dataBuffer);
      }
      const pdfData = await pdfParse(dataBuffer);
      if (pdfData) {
        console.log(pdfData)
      } else {
        console.log('no pdf data')
      }
      results.push({ filename: file.originalname, text: pdfData.text });
    } catch (error) {
      results.push({ filename: file.originalname, error: 'Failed to parse PDF' });
    }

    // Optionally, delete the file after processing
    //fs.unlinkSync(filePath);
  }

  res.json(results);
});

module.exports = router;

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
