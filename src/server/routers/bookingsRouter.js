require("dotenv").config();
const express = require("express");
const {
  getBookings,
  deleteBooking,
} = require("../controllers/bookingsControllers");

const bookingsRouter = express.Router();

bookingsRouter.get("/", getBookings);
bookingsRouter.delete("/:id", deleteBooking);

module.exports = bookingsRouter;
