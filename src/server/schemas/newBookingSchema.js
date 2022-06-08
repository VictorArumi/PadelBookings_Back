const { Joi } = require("express-validation");

const newBookingSchema = {
  body: Joi.object({
    club: Joi.string()
      .max(20)
      .messages({ message: "Club is required" })
      .required(),

    owner: Joi.string().messages({ message: "Owner is required" }).required(),

    date: Joi.string()
      .min(10)
      .max(10)
      .messages({ message: "Date is required" })
      .required(),

    hour: Joi.string()
      .min(2)
      .max(20)
      .messages({ message: "Hour is required" })
      .required(),

    courtType: Joi.string()
      .regex(/^(indoor|outdoor)$/)
      .messages({ message: "CourtType is required" })
      .required(),

    players: Joi.array()
      .max(4)
      .messages({ message: "Players is required" })
      .required(),

    open: Joi.boolean()
      .messages({ message: "Reserve open/closed status is required" })
      .required(),
  }),
};

module.exports = newBookingSchema;
