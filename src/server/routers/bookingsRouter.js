require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const {
  getBookings,
  deleteBooking,
  createBooking,
  editBooking,
} = require("../controllers/bookingsControllers");
const auth = require("../middlewares/auth/auth");
const newBookingSchema = require("../schemas/newBookingSchema");

const bookingsRouter = express.Router();

bookingsRouter.get("/", auth, getBookings);
bookingsRouter.delete("/:id", auth, deleteBooking);
bookingsRouter.post("/create", auth, validate(newBookingSchema), createBooking);
bookingsRouter.put("/edit/:id", auth, validate(newBookingSchema), editBooking);

module.exports = bookingsRouter;
