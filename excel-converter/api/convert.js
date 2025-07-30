import formidable from "formidable";
import fs from "fs";
import xlsx from "xlsx";

// Disable default body parser so we can use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res.status(500).json({ error: "Error parsing the file" });
    }

    try {
      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = file[0].filepath;
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      return res.status(200).json(jsonData);
    } catch (err) {
      console.error("Conversion error:", err);
      return res.status(500).json({ error: "Failed to convert Excel file" });
    }
  });
}
