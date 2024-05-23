export interface Job {
  title: string;
  briefDescription: string;
  description: string;
  postedBy: string;
  skills: [string];
  minExperience: number;
  maxExperience: number;
  minPackage: number;
  maxPackage: number;
  openings: number;
  jobTypeId: number;
  workLocationId: number;
  workLocation?: string;
  jobType: string;
  postDate: Date;
  jobLocation: string;
  companyDetails: companyDetails;
}

interface companyDetails {
  companyName: string;
  companyLogo: string;
  location: string;
  website: string;
  About: string;
  contactNumber: string;
}

export interface IFilterQuery {
  jobTypeId?: string;
  workLocationId?: string;
}

export interface IFilterSalaryRange {
  maxPackage?: number;
  minPackage?: number;
}

export interface IFilterExperience {
  minExperience?: number;
  maxExperience?: number;
}
