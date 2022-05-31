require("dotenv").config();
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

module.exports = {
  userRegister,
};
