const Booking = require("../../database/models/Booking");

require("dotenv").config();

const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch {
    const error = new Error();
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Booking.findByIdAndRemove(id);
    res.status(200).json({ msg: "item deleted", id });
  } catch {
    const error = new Error();
    error.statusCode = 404;
    error.customMessage = "Couldn't delete: item not found";
    next(error);
  }
};

module.exports = { getBookings, deleteBooking };
