require("dotenv").config();
const express = require("express");
const { getBookings } = require("../controllers/bookingsControllers");

const bookingsRouter = express.Router();

bookingsRouter.get("/", getBookings);

module.exports = bookingsRouter;
