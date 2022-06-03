const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../database");
const app = require("..");
const mockBookings = require("../../mocks/mockBookings");
const Booking = require("../../database/models/Booking");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a GET /bookings endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should return the database list of bookings", async () => {
      await Booking.create(mockBookings[0]);
      await Booking.create(mockBookings[1]);
      const expectedBookings = 2;
      const {
        body: { bookings },
      } = await request(app).get("/bookings").expect(200);

      expect(bookings[0].club).toBe(mockBookings[0].club);
      expect(bookings[1].owner).toBe(mockBookings[1].owner);
      expect(bookings).toHaveLength(expectedBookings);
    });
  });
});
