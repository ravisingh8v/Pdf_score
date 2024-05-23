import express from "express";
import loginUser from "../controller/login.controller";

//define login route
const loginRoute = express.Router();

loginRoute.route("/").post(loginUser);

export default loginRoute;
