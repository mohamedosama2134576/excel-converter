const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());

app.post("/convert", upload.single("file"), (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);
    fs.unlinkSync(req.file.path);
    res.json({ data: json });
  } catch (err) {
    res.status(500).json({ error: "Failed to convert file." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
