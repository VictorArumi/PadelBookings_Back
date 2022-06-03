const Booking = require("../../database/models/Booking");
const mockBookings = require("../../mocks/mockBookings");
const { getBookings } = require("./bookingsControllers");

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
      expect(res.json).toHaveBeenCalledWith(mockBookings);
    });
  });
});
