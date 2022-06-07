require("dotenv").config();
const express = require("express");
const {
  getBookings,
  deleteBooking,
} = require("../controllers/bookingsControllers");
const auth = require("../middlewares/auth/auth");

const bookingsRouter = express.Router();

bookingsRouter.get("/", auth, getBookings);
bookingsRouter.delete("/:id", auth, deleteBooking);

module.exports = bookingsRouter;
