require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const multer = require("multer");
const path = require("path");
const { userRegister, userLogin } = require("../controllers/userControllers");
const userRegisterCredentialsSchema = require("../schemas/userCredentialsSchema");

const userRouter = express.Router();

const upload = multer({
  dest: path.join("uploads", "images"),
  limits: {
    fileSize: 5000000,
  },
});

userRouter.post("/login", userLogin);
userRouter.post(
  "/register",
  upload.single("profilePicture"),
  validate(userRegisterCredentialsSchema),
  userRegister
);

module.exports = userRouter;
