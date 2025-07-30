import multer from 'multer';
import xlsx from 'xlsx';

// Setup multer in memory
const upload = multer({ storage: multer.memoryStorage() });

// Wrap multer for Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  upload.single('file')(req, {}, function (err) {
    if (err) return res.status(500).json({ error: 'File upload failed' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = xlsx.utils.sheet_to_json(sheet);
      res.status(200).json(json);
    } catch (e) {
      res.status(500).json({ error: 'Conversion failed', details: e.message });
    }
  });
}
