const Booking = require("../../database/models/Booking");

require("dotenv").config();

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch {
    const error = new Error();
    error.statusCode = 404;
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    await Booking.findByIdAndRemove(id);
    res.status(200).json({ msg: "pendienteeeeeeee" });
  } catch {
    const error = new Error();
    error.statusCode = 404;
  }
};

module.exports = { getBookings, deleteBooking };
