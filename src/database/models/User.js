const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: { type: String },
  profilePicture: {
    type: String,
  },
  bookings: {
    type: [Schema.Types.ObjectId],
    ref: "Booking",
    default: [],
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
