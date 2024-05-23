import express from "express";
// ===================================================
import { checkJobId, getJob, getJobList } from "./../controller/job.controller";

// Define Job Route
const jobRouter = express.Router();

// middleware
jobRouter.param("id", checkJobId);

// Job routes
jobRouter.route("/").get(getJobList);
jobRouter.route("/:id").get(getJob);

export default jobRouter;
