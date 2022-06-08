const Booking = require("../../database/models/Booking");
const {
  mockBookings,
  mockNewBookingBody,
} = require("../../mocks/mockBookings");
const {
  getBookings,
  deleteBooking,
  createBooking,
} = require("./bookingsControllers");

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a getBookings function", () => {
  describe("When it's invoked with a response", () => {
    test("Then it should call the response's method status with a 200, and json method with a list of bookings", async () => {
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
    test("Then it should call the response's method status with a 200, and json with msg: ", async () => {
      const idTodelete = "deleteThisId";
      const expectedJson = {
        msg: `Item with id ${idTodelete} has been deleted`,
      };
      const req = {
        params: { id: idTodelete },
      };
      const expectedStatusCode = 200;
      Booking.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      await deleteBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it's invoked with an id that doesn't exist", () => {
    test("Then it should call next with an error", async () => {
      const idTodelete = "deleteThisId";

      const req = {
        params: { id: idTodelete },
      };

      const expectedError = new Error();

      Booking.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await deleteBooking(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a createBooking function", () => {
  describe("When it's called with a request with valid new booking object", () => {
    test("Then it should call the response's method status with a 201, and json method with object with property createdBooking with createdbooking inside", async () => {
      const req = {
        body: mockNewBookingBody,
      };
      const mockId = "thisIsAMockId";
      const expectedJson = {
        createdBooking: { ...mockNewBookingBody, id: mockId },
      };
      const expectedStatus = 201;

      Booking.create = jest
        .fn()
        .mockResolvedValue({ ...mockNewBookingBody, id: mockId });
      await createBooking(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it's called with a request with invalid new booking object", () => {
    test("Then it should call the response's method status with a 201, and json method with object with property createdBooking with createdbooking inside", async () => {
      const req = {};

      const expectedError = new Error();
      Booking.create = jest.fn().mockRejectedValue(expectedError);
      await createBooking(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
