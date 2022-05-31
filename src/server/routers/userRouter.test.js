const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../database");
const app = require("..");
const User = require("../../database/models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectDB(mongoServer.getUri());
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a POST /users/register/ endpoint", () => {
  describe("When it receives a request with a valid new user", () => {
    test("Then it should respond with 201 status code", async () => {
      const newUserData = {
        username: "testusername",
        password: "newpassword",
        name: "newname",
      };

      await request(app).post("/user/register").send(newUserData).expect(201);
    });
  });
});
