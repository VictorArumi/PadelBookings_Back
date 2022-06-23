const { Joi } = require("express-validation");

const userRegisterCredentialsSchema = {
  body: Joi.object({
    username: Joi.string()
      .max(20)
      .messages({ message: "Username is required" })
      .required(),
    password: Joi.string()
      .min(4)
      .max(20)
      .messages({ message: "Password is required" })
      .required(),
    name: Joi.string().max(20),
    profilePicture: Joi.string().allow(null, ""),
  }),
};

module.exports = userRegisterCredentialsSchema;
