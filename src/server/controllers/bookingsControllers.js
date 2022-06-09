require("dotenv").config();
const debug = require("debug")("padelbookings:server:booking-controllers");
const chalk = require("chalk");
const Booking = require("../../database/models/Booking");

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
    debug(chalk.green(`Bookings list delivered`));
  } catch {
    next();
  }
};

const createBooking = async (req, res, next) => {
  try {
    const newBookingData = req.body;

    const createdNewBooking = await Booking.create(newBookingData);

    res.status(201).json({ createdBooking: createdNewBooking });
    debug(chalk.green(`New booking ${createdNewBooking.id} created`));
  } catch (error) {
    error.statusCode = 400;
    error.customMessage = "Bad request";
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findBooking = await Booking.findByIdAndDelete(id);

    if (findBooking === null) {
      const error = new Error();
      error.statusCode = 404;
      error.customMessage = "Couldn't delete: non-existent item";
      next(error);
      return;
    }
    res.status(200).json({ msg: `Item with id ${id} has been deleted` });
    debug(chalk.green(`Booking ${id} has been deleted`));
  } catch (error) {
    error.statusCode = 400;
    error.customMessage = "Bad request";
    next(error);
  }
};

const editBooking = async (req, res, next) => {
  const { id } = req.params;
  const booking = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, booking, {
      new: true,
    });
    res.status(200).json({ updatedBooking });
  } catch (error) {
    error.statusCode = 404;
    error.customMessage = "Error, booking not found";
    next(error);
  }
};

module.exports = { getBookings, deleteBooking, createBooking, editBooking };
