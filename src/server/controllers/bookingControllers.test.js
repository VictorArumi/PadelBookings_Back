const Booking = require("../../database/models/Booking");
const mockBookings = require("../../mocks/mockBookings");
const { getBookings, deleteBooking } = require("./bookingsControllers");

describe("Given a getBookings function", () => {
  describe("When it's invoked with a response", () => {
    test("Then it should call the response's method status with a 200, and json method with a list of bookings", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedStatusCode = 200;
      Booking.find = jest.fn().mockResolvedValue(mockBookings);

      await getBookings(null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith({ bookings: mockBookings });
    });
  });
});

describe("Given a deleteBooking function", () => {
  describe("When it's invoked with params id: deleteThisId", () => {
    test("Then it should call the response's method status with a 200, and json method with a list of bookings", async () => {
      const idTodelete = "deleteThisId";
      const expectedJson = { msg: "item deleted", id: idTodelete };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = {
        params: { id: idTodelete },
      };
      const expectedStatusCode = 200;
      Booking.findByIdAndRemove = jest.fn();

      await deleteBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it's invoked with an id that doesn't exist", () => {
    test("Then it should call next", async () => {
      const idTodelete = "deleteThisId";
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const req = {
        params: { id: idTodelete },
      };
      const next = jest.fn();
      const expectedError = new Error();
      expectedError.statusCode = 404;
      expectedError.customMessage = "Couldn't delete: item not found";

      Booking.findByIdAndRemove = jest.fn().mockRejectedValue(expectedError);

      await deleteBooking(req, res, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
