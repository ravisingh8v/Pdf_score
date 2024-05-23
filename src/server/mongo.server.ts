import { MongoClient } from "mongodb";
//database uri where mongo start
const uri = process.env.DATABASE || "";

//create instance of mongo client to workwith mongo db
const client = new MongoClient(uri);

export default client;
