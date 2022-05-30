const connectDB = require("./database/index");

connectDB(process.env.MONGODB_STRING);
