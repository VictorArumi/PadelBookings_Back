const chalk = require("chalk");
const { ValidationError } = require("express-validation");
const debug = require("debug")("padelbookings:server:middlewares:errors");

const notFoundError = (req, res) => {
  res.status(404).json({ msg: "Endpoint not found" });
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    // eslint-disable-next-line no-param-reassign
    error.customMessage = "Bad Request: Form validation failed";
  }

  const errorStatusCode = error.statusCode ?? 500;
  const errorMessage = error.customMessage ?? "General error";

  debug(chalk.red(`Error: ${errorMessage}`));
  res.status(errorStatusCode).json({ msg: errorMessage });
};

module.exports = {
  notFoundError,
  generalError,
};
