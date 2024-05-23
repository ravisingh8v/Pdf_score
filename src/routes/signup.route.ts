import express from "express";
import signup from "../controller/signup.controller";
const signupRoute = express.Router();

//handle signup route
signupRoute.route("/").post(signup);

export default signupRoute;
