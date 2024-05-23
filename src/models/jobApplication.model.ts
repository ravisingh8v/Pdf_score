export interface IJobApplication {
  jobPostId: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  createdAt: Date;
  cv: IJobCV;
}

interface IJobCV {
  id: string;
  name: string;
  url: string;
}
