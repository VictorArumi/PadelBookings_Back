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
  } catch (error) {
    next(error);
  }
};

module.exports = { getBookings, deleteBooking };
