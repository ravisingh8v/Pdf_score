import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import jobRoute from "./src/routes/job.routes";
import jobApplicationRouter from "./src/routes/jobApplication.routes";
import pdfRoute from "./src/routes/pdf.routes";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//create instance of express
const app = express();

//add middleware for parsing req data

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//routes middleware

// ========Remove Login and signup flow===========
// app.use("/api/login", loginRoute);
// app.use("/api/signup", signupRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/pdf", pdfRoute);
app.use("/api/applications", jobApplicationRouter);
export default app;
