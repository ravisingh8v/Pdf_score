import { Collection, Db } from "mongodb";
// ==============================================
import client from "../server/mongo.server";

// select database and collection
const database: Db = client.db("JobBoard");
const jobs: Collection = database.collection("PDF");

export function insertPDF(body: any) {
  console.log("works");
  const data = jobs.insertOne(body);
  return data;
}
