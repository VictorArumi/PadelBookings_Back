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

afterEach(async () => {
  await Booking.deleteMany({});
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

describe("Given a DELETE /bookings/:id endpoint", () => {
  describe("When it receives a request with existent item params id: '629a19fe5a16e50d33d55cb3'", () => {
    test("Then it should return a message 'item deleted' and the id '629a19fe5a16e50d33d55cb3'", async () => {
      const { id: idToDelete } = await Booking.create(mockBookings[0]);
      const expectedMsg = `Item with id ${idToDelete} has been deleted`;

      const {
        body: { msg },
      } = await request(app).delete(`/bookings/${idToDelete}`).expect(200);

      expect(msg).toBe(expectedMsg);
    });
  });

  describe("When it receives a request with unexistent params id: 'non-existent'", () => {
    test("Then it should return a message 'item deleted' and the id 'non-existent'", async () => {
      const idToDelete = "non-existent";
      const expectedMsg = "Couldn't delete: non-existent item";
      await Booking.create(mockBookings[0]);

      const {
        body: { msg },
      } = await request(app).delete(`/bookings/${idToDelete}`).expect(404);

      expect(msg).toBe(expectedMsg);
    });
  });
});
