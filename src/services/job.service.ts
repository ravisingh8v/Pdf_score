import { Collection, Db, ObjectId } from "mongodb";
// ==============================================
import { IFilterExperience, IFilterQuery } from "../models/job.model";
import client from "../server/mongo.server";
import { DEFAULT_MAX, DEFAULT_MIN, JOB_AGGREGATE } from "../utilites/contants";

// select database and collection
const database: Db = client.db("JobBoard");
const jobs: Collection = database.collection("jobs");

// exporting list of jobs finding from selected database and collection
export async function getJobs(
  queryObj: IFilterQuery,
  sortBy: number,
  // salaryRange: IFilterSalaryRange,
  experience: IFilterExperience,
  searchText?: any
) {
  // Query for all the data which is in the jobs collection
  const jobList = await jobs
    .aggregate([
      ...JOB_AGGREGATE.slice(0, JOB_AGGREGATE.length - 1),
      {
        $match: {
          ...queryObj,
          maxExperience: {
            $gte: experience.minExperience || DEFAULT_MIN,
            $lte: experience.maxExperience || DEFAULT_MAX,
          },
          $or: [
            {
              title: {
                $regex: new RegExp(searchText),
                $options: "i",
              },
            },
            {
              skills: {
                $regex: new RegExp(searchText),
                $options: "i",
              },
            },
          ],
          // minPackage: { $lte: salaryRange.maxPackage || DEFAULT_MAX },
          // maxPackage: { $gte: salaryRange.minPackage || DEFAULT_MIN },
        },
      },
      {
        $sort: {
          postDate: sortBy,
        },
      },
      JOB_AGGREGATE[JOB_AGGREGATE.length - 1],
    ])
    .toArray();
  return jobList;
}

// exporting list of jobs finding from selected database and collection
export async function getJobById(id: ObjectId) {
  // Query for all the data which is in the jobs collection
  const jobList = await jobs
    .aggregate([
      ...JOB_AGGREGATE.slice(0, JOB_AGGREGATE.length - 1),
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        ...JOB_AGGREGATE[JOB_AGGREGATE.length - 1],
      },
    ])
    .toArray();
  return jobList[0];
}

// exporting boolean for id is available or not
export async function checkIdIsAvailable(id: ObjectId) {
  try {
    await jobs.findOne({ _id: new ObjectId(id) });
    return true;
  } catch (err) {
    return false;
  }
}
