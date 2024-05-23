import express from "express";
import {
  getJobApplication,
  postJobApplication,
  upload,
} from "../controller/jobApplication.controller";
const jobApplicationRouter = express.Router();

jobApplicationRouter
  .route("/")
  .get(getJobApplication)
  .post(upload.single("cv"), postJobApplication);

export default jobApplicationRouter;
