require("dotenv").config();
const debug = require("debug")("padelbookings:server:controllers");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../database/models/User");

const userRegister = async (req, res, next) => {
  try {
    const { username, password, name } = req.body;
    const user = await User.findOne({ username });

    if (user) {
      const error = new Error();
      error.statusCode = 409;
      error.customMessage = "This username already exists";

      next(error);
      return;
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: encryptedPassword,
      name,
    });

    res.status(201).json({ username });
  } catch (error) {
    error.statusCode = 400;
    error.customMessage = "Bad request";
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (typeof username === "undefined") {
      const error = new Error();
      error.statusCode = 400;
      error.customMessage = "Bad request";

      next(error);
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      const error = new Error();
      debug(chalk.red("Wrong username"));
      error.statusCode = 403;
      error.customMessage = "Username or Password is wrong";

      next(error);
      return;
    }

    const rightPassword = await bcrypt.compare(password, user.password);
    if (!rightPassword) {
      const error = new Error();
      debug(chalk.red("Wrong Password"));
      error.statusCode = 403;
      error.customMessage = "Username or Password is wrong";

      next(error);
      return;
    }

    const userData = {
      id: user.id,
      username: user.username,
    };
    const token = jwt.sign(userData, process.env.JWT_SECRET);
    debug(chalk.blueBright(`User ${userData.username} logged in`));

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
};
