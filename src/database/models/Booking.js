const { Schema, model } = require("mongoose");

const BookingSchema = new Schema({
  club: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String,
    required: true,
    unique: true,
  },
  hour: {
    type: String,
    required: true,
  },
  courtType: {
    type: String,
    enum: ["Indoor", "Outdoor"],
  },
  players: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const Booking = model("Booking", BookingSchema, "bookings");

module.exports = Booking;
