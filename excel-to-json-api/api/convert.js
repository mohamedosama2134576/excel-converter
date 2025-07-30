export const config = { api: { bodyParser: false } };

import multer from 'multer';
import xlsx from 'xlsx';

const upload = multer({ storage: multer.memoryStorage() });

export default function handler(req, res) {
  upload.single('file')(req, {}, err => {
    if (err) return res.status(500).json({ error: 'Upload failed' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    res.json(xlsx.utils.sheet_to_json(sheet));
  });
}
