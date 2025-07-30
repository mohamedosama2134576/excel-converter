import multer from 'multer';
import xlsx from 'xlsx';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

export default function handler(req, res) {
  upload.single('file')(req, {}, err => {
    if (err) {
      return res.status(500).json({ error: 'Upload failed', details: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(sheet, { defval: null });
      return res.status(200).json({ data: json });
    } catch (e) {
      return res.status(500).json({ error: 'Conversion failed', details: e.message });
    }
  });
}
