import { Request, Response } from "express";
import fs from "fs";
import PdfParse from "pdf-parse";
export async function postPDF(req: Request, res: Response) {
  const filePath = req.file?.path;
  const body = req.body;
  //   const data = await insertPDF(body);

  //   pdfParse(file);

  filePath &&
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Failed to read file" });
      }

      PdfParse(data)
        .then((result) => {
          const resumeText = result.text;
          console.log(resumeText);
          const score = scoreResume(resumeText);
          res.json({ score });
        })
        .catch((err) => {
          res.status(500).json({ error: "Failed to parse PDF" });
        });
    });
}

const jobDescriptionKeywords = [
  "JavaScript",
  "React",
  "Node.js",
  "CSS",
  "HTML",
  "reading", // add more keywords as needed
];

function scoreResume(text: any) {
  const textLower = text.toLowerCase();
  let score = 0;

  jobDescriptionKeywords.forEach((keyword) => {
    if (textLower.includes(keyword.toLowerCase())) {
      score += 10; // assign points per keyword match
    }
  });

  return score;
}
