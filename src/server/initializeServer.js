require("dotenv").config();
const debug = require("debug")("padelbookings:server:initializeServer");
const chalk = require("chalk");
const app = require(".");

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Server listening on port ${port}`));
      resolve();
    });

    server.on("error", (error) => {
      debug(chalk.bgRed("Error initializing server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.bgMagenta(`Port ${port} is already in use`));
        reject();
      }
    });
  });

module.exports = initializeServer;
