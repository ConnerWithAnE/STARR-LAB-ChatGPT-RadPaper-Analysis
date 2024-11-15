const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static('public')); // To serve static files

// Endpoint to handle PDF uploads
app.post('/upload', upload.array('pdfs'), async (req, res) => {
  const files = req.files;
  let results = [];

  for (const file of files) {
    const filePath = path.join(__dirname, file.path);
    const dataBuffer = fs.readFileSync(filePath);

    try {
      const pdfData = await pdfParse(dataBuffer);
      results.push({ filename: file.originalname, text: pdfData.text });
    } catch (error) {
      results.push({ filename: file.originalname, error: 'Failed to parse PDF' });
    }

    // Optionally, delete the file after processing
    fs.unlinkSync(filePath);
  }

  res.json(results);
});

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
