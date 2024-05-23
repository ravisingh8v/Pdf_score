import { Request, Response } from "express";
import Joi from "joi";
import getUserByEmail from "../services/users.service";
import { User } from "../models/signup.model";
import client from "../server/mongo.server";
import encryptPassword from "../utilites/password.util";

//save user data to database
async function saveUser(data: User) {
  const database = client.db("JobBoard");
  const users = database.collection<User>("users");

  const user = await users.insertOne(data);
  return user.acknowledged;
}

//sign up new user
async function signup(req: Request, res: Response) {
  const data = req.body;

  //Schema for request data validation
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .pattern(new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i))
      .required(),
    role: Joi.string().valid("jobSeeker", "employer").required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:<>?])(?=.*[a-zA-Z]).{6,50}$/
        )
      )
      .required(),
  });

  const { error } = schema.validate(data);
  //if invalid data from request
  if (error) {
    res.status(400).json({
      status: "failed",
      message: error.details[0].message,
    });
    return;
  }
  try {
    //check if user is already register
    const isUserExist = await getUserByEmail(data.email);

    //return if user is already register
    if (isUserExist) {
      res.status(409).json({
        staus: "failed",
        message: "User is already register please login",
        data: {
          email: data.email,
        },
      });
      return;
    }

    // Query for a add user in db
    const isUserSaved = await saveUser({
      ...data,
      password: await encryptPassword(data.password),
    }).catch(console.dir);

    //usersaved in database
    if (isUserSaved) {
      res.status(201).json({
        status: "success",
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
        },
      });
    } else {
      res.status(500).json({
        staus: "failed",
        message: "Signup faild",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}

export default signup;
