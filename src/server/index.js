const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const userRouter = require("./routers/userRouter");
const { notFoundError, generalError } = require("./middlewares/errors/errors");
const bookingsRouter = require("./routers/bookingsRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());

app.use("/user", userRouter);
app.use("/bookings", bookingsRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
