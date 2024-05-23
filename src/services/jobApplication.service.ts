import { Collection, Db } from "mongodb";
import client from "../server/mongo.server";
import { IJobApplication } from "../models/jobApplication.model";

const db: Db = client.db("JobBoard");
const applications: Collection = db.collection("job-applications");

export async function insertJobApplicationIntoDatabase(
  jobApplication: IJobApplication
) {
  const application = await applications.insertOne(jobApplication);
  return application;
}
export async function getJobApplicationFromDatabase() {
  const application = await applications
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return application;
}
