require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const { userRegister, userLogin } = require("../controllers/userControllers");
const userRegisterCredentialsSchema = require("../schemas/userCredentialsSchema");

const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(userRegisterCredentialsSchema),
  userRegister
);

userRouter.post("/login", userLogin);

module.exports = userRouter;
