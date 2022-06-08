require("dotenv").config();
const express = require("express");
const {
  getBookings,
  deleteBooking,
  createBooking,
} = require("../controllers/bookingsControllers");
const auth = require("../middlewares/auth/auth");

const bookingsRouter = express.Router();

bookingsRouter.get("/", auth, getBookings);
bookingsRouter.delete("/:id", auth, deleteBooking);
bookingsRouter.post("/create", auth, createBooking);

module.exports = bookingsRouter;
