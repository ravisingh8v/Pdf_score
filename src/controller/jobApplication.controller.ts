import { Request, Response } from "express";
import multer from "multer";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utilites/cloudinary";
import fs, { stat } from "fs";
import { IJobApplication } from "../models/jobApplication.model";
import Joi from "joi";
import {
  getJobApplicationFromDatabase,
  insertJobApplicationIntoDatabase,
} from "../services/jobApplication.service";

// using disk storage to first store data into local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

// Validation schema : TODO: need to check the jobPostId is already available in the job list
const schema = Joi.object({
  jobPostId: Joi.string().required(),
  firstName: Joi.string().alphanum().min(2).max(30).required(),
  lastName: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string()
    .pattern(new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i))
    .required(),
  contactNumber: Joi.string()
    .pattern(new RegExp(/^\d*$/))
    .required()
    .length(10),
});

let public_id: any;

/**
 * POST Job Applications
 * @param req
 * @param res
 * @returns
 */
export async function postJobApplication(req: Request, res: Response) {
  const data = req.body;
  const file = req.file;

  const { error } = schema.validate(data);

  if (error && file) {
    fs.unlinkSync(file?.path);
  }

  if (error || !file) {
    res.status(400).json({
      status: "failed",
      message: error?.message ? error.message : "please upload the cv",
    });
    return;
  }

  try {
    const result = await uploadOnCloudinary(file?.path);
    if (!result) {
      res.status(400).json({
        status: "failed",
        message: "Invalid file",
      });
      return;
    }
    // delete file from local when its uploaded into cloudinary
    fs.unlinkSync(file?.path);

    // collecting require details from the result
    const cv = {
      id: result?.public_id,
      name: result?.original_filename,
      url: result?.secure_url,
    };
    public_id = cv.id;

    const application: IJobApplication = {
      ...data,
      contactNumber: data.contactNumber.toString(),
      createdAt: new Date(),
      cv,
    };

    await insertJobApplicationIntoDatabase(application);

    res.status(201).json({
      status: "success",
      data: application,
    });
  } catch (error) {
    await deleteFromCloudinary(public_id);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

export async function getJobApplication(req: Request, res: Response) {
  const { role } = req.headers;
  if (role === "admin") {
    try {
      const applications = await getJobApplicationFromDatabase();
      res.status(200).json({
        status: "success",
        data: applications,
      });
    } catch (error) {
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  } else {
    res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
}
