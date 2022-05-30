require("dotenv").config();
const debug = require("debug")("padelbookings:root");
const chalk = require("chalk");

const connectDB = require("./database/index");
const initializeServer = require("./server/initializeServer");

const port = process.env.PORT ?? 4000;
const connectionString = process.env.MONGODB_STRING;

(async () => {
  try {
    await connectDB(connectionString);
    await initializeServer(port);
  } catch {
    debug(chalk.red("Exiting with errors"));
    process.exit(1);
  }
})();
