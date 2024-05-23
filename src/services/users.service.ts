import client from "../server/mongo.server";

export default async function getUserByEmail(email: string) {
  const database = client.db("JobBoard");
  const isEmailExist = await database
    .collection("users")
    .findOne({ email: email });

  return isEmailExist ? true : false;
}
