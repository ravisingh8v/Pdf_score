import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Joi from "joi";
import client from "../server/mongo.server";
// check user is authenticate with our application

//post request handler for authentication
async function authenticateUser(data: any) {
  const database = client.db("JobBoard");
  const users = database.collection("users");

  // Query for a movie that has the title 'Back to the Future'
  const user = await users.findOne(data);
  return user;
}

//login user
async function loginUser(req: Request, res: Response) {
  const data = req.body;
  const schema = Joi.object({
    email: Joi.string()
      .pattern(new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i))
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:<>?])(?=.*[a-zA-Z]).{6,50}$/
        )
      )
      .required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    res.status(400).json({
      status: "failed",
      message: error.details[0].message,
    });
    return;
  }
  try {
    const user = await authenticateUser({ email: data.email });

    // Compare hashed password with provided password
    const isPasswordValid = await bcrypt.compare(data.password, user?.password);

    if (user && isPasswordValid) {
      res.status(200).json({
        status: "success",
        data: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          isauthenticate: true,
        },
      });
    } else {
      //check if valid user enter wrong password
      if (user && !isPasswordValid) {
        res.status(401).json({
          status: "failed",
          message: "Password is invalid please enter valid password",
        });
        return;
      }
      res.status(401).json({
        stutus: "failed",
        message: "User is not authenticated",
      });
    }
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
}
export default loginUser;
