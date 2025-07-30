import formidable from "formidable";
import xlsx from "xlsx";
import fs from "fs";


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Failed to parse file" });
      return;
    }

    const file = files.file;
    const filepath = file[0].filepath;
    const workbook = xlsx.readFile(filepath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.status(200).json(data);
  });
}
