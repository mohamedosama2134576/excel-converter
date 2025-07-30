// api/convert.js
import multer from "multer";
import xlsx from "xlsx";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  upload.single("file")(req, {}, (err) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed", details: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = xlsx.utils.sheet_to_json(sheet, { defval: null });
      res.status(200).json(json);
    } catch (e) {
      res.status(500).json({ error: "Conversion failed", details: e.message });
    }
  });
}
