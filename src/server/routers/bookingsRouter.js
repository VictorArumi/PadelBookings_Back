require("dotenv").config();
const express = require("express");
const { validate } = require("express-validation");
const {
  getBookings,
  deleteBooking,
  createBooking,
  editBooking,
  getBooking,
  editBookingPlayers,
  getBookingAndPlayersUsernames,
} = require("../controllers/bookingsControllers");
const auth = require("../middlewares/auth/auth");
const newBookingSchema = require("../schemas/newBookingSchema");

const bookingsRouter = express.Router();

bookingsRouter.get("/limit=:limit&page=:page", auth, getBookings);
bookingsRouter.get(
  "/detail/:id",
  auth,
  getBooking,
  getBookingAndPlayersUsernames
);
bookingsRouter.delete("/:id", auth, deleteBooking);
bookingsRouter.post("/create", auth, validate(newBookingSchema), createBooking);
bookingsRouter.put("/edit/:id", auth, validate(newBookingSchema), editBooking);
bookingsRouter.put("/edit/addplayer/:id", auth, editBookingPlayers);

module.exports = bookingsRouter;
