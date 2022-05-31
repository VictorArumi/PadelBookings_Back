const chalk = require("chalk");
const debug = require("debug")("padelbookings:server:middlewares:errors");

const notFoundError = (req, res) => {
  res.status(404).json({ msg: "Endpoint not found" });
};

// eslint-disable-next-line no-unused-vars
const generalError = (error, req, res, next) => {
  const errorStatusCode = error.statusCode ?? 500;
  const errorMessage = error.customMessage ?? "General error";
  debug(chalk.red(`Error: ${errorMessage}`));
  res.status(errorStatusCode).json({ msg: errorMessage });
};

module.exports = {
  notFoundError,
  generalError,
};
