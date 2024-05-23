import bcrypt from "bcrypt";

//encript password usnig bcrypt
export default async function encryptPassword(value: string) {
  return await bcrypt.hash(value, 10);
}
