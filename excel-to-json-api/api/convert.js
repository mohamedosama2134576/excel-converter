import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const json = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed', details: err.message });
  }
});

export default app;
