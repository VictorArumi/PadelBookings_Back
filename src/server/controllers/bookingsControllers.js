require("dotenv").config();
const debug = require("debug")("padelbookings:server:booking-controllers");
const chalk = require("chalk");
const Booking = require("../../database/models/Booking");
const User = require("../../database/models/User");

const getBookings = async (req, res, next) => {
  const { limit, page } = req.params;
  const { type, status, date, user, owner } = req.query;
  debug(type);
  if (!(limit && page)) {
    const error = new Error();
    error.statusCode = 400;
    error.customMessage = "Missing pagination data";

    debug(chalk.red(error.customMessage));

    next(error);
  }

  const queryFilter = {};

  if (type) {
    queryFilter.courtType = type;
  }
  if (status) {
    queryFilter.open = status;
  }
  if (date) {
    queryFilter.date = date;
  }
  if (user) {
    queryFilter.players = user;
  }
  if (owner) {
    queryFilter.owner = owner;
  }

  try {
    const bookings = await Booking.find(queryFilter)
      .limit(limit)
      .skip(limit * (page - 1));
    res.status(200).json({ bookings });

    debug(chalk.green(`Bookings delivered`));
  } catch {
    next();
  }
};

const getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    const bookingWithPopulatedPlayers = await Booking.findById(id).populate(
      "players",
      null,
      User
    );

    const playersUsernames = bookingWithPopulatedPlayers.players.map(
      (user) => user.username
    );

    res.status(200).json({ booking, playersUsernames });
    debug(chalk.green(`Booking with id ${id} delivered`));
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

module.exports = {
  getBookings,
  getBooking,
  deleteBooking,
  createBooking,
  editBooking,
};
