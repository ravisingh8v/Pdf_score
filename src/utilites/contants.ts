// Both are the default numbers

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100000000;

const JOB_OBJECT = {
  _id: 1,
  title: 1,
  briefDescription: 1,
  description: 1,
  postedBy: 1,
  skills: 1,
  minExperience: 1,
  maxExperience: 1,
  minPackage: 1,
  maxPackage: 1,
  openings: 1,
  jobTypeId: 1,
  workLocationId: 1,
  postDate: 1,
  jobLocation: 1,
  companyDetails: 1,
  jobType: 1,
  workLocation: 1,
};

const JOB_AGGREGATE = [
  {
    $lookup: {
      from: "job-types",
      localField: "jobTypeId",
      foreignField: "_id",
      as: "jobType",
    },
  },
  {
    $lookup: {
      from: "work-locations",
      localField: "workLocationId",
      foreignField: "_id",
      as: "workLocation",
    },
  },
  { $unwind: "$jobType" },
  { $unwind: "$workLocation" },
  {
    $project: {
      ...JOB_OBJECT,
      jobType: "$jobType.name",
      workLocation: "$workLocation.name",
    },
  },
];

export { DEFAULT_MIN, DEFAULT_MAX, JOB_OBJECT, JOB_AGGREGATE };
