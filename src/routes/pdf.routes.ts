import express from "express";
import { upload } from "../controller/jobApplication.controller";
import { postPDF } from "../controller/pdf.controller";
const pdfRoute = express.Router();

//handle signup route
pdfRoute.route("/").post(upload.single("cv"), postPDF);

export default pdfRoute;
