const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const connectDB = require("../../database");
const app = require("..");
const User = require("../../database/models/User");
const mockUser = require("../../mocks/mockUser");

let mongoServer;

jest.mock("firebase/storage", () => ({
  ref: jest.fn().mockReturnValue("profilePicture"),
  uploadBytes: jest.fn().mockResolvedValue(),
  getStorage: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("url"),
}));

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

const newUserData = {
  username: "testusername",
  password: "newpassword",
  name: "testname",
  profilePicture: "testpicture.jpg",
};

describe("Given a POST /users/register/ endpoint", () => {
  describe("When it receives a request with a valid new user", () => {
    test("Then it should respond with 201 status code", async () => {
      const { body } = await request(app)
        .post("/user/register")
        .type("multipart/formd-ata")
        .field("username", mockUser.username)
        .field("password", mockUser.password)
        .field("name", mockUser.name)
        .attach("profilePicture", Buffer.from("mockImageString", "utf-8"), {
          filename: "mockiamge",
          originalname: "image.jpg",
        })
        .expect(201);

      expect(body).toEqual({ username: mockUser.username });
    });
  });

  describe("When it receives a request with a wrong new user", () => {
    test("Then it should respond with 400 status code and the created user", async () => {
      const badNewUserData = {
        username: "testusername",
        wrongproperty: "newpassword",
        name: "newname",
      };

      await request(app)
        .post("/user/register")
        .send(badNewUserData)
        .expect(400);
    });
  });

  describe("When it receives a request with a user that already exists", () => {
    test("Then it should respond with 409 status code", async () => {
      await User.create(newUserData);

      await request(app).post("/user/register").send(newUserData).expect(409);
    });
  });
});

describe("Given a POST /users/login/ endpoint", () => {
  describe("When it receives a request with an existing user and it's right password", () => {
    test("Then it should respond with a 200 status code and a token", async () => {
      const newUserLoginData = {
        username: newUserData.username,
        password: newUserData.password,
      };

      await request(app).post("/user/register").send(newUserData);

      const {
        body: { token },
      } = await request(app)
        .post("/user/login")
        .send(newUserLoginData)
        .expect(200);

      expect(token).not.toBeNull();
    });
  });

  describe("When it receives a request with a wrong username", () => {
    test("Then it should respond with a 403 status code, and a json with msg: 'Username or Password is wrong'", async () => {
      const expectedErrorMessage = "Username or Password is wrong";
      await User.create(newUserData);

      const {
        body: { msg },
      } = await request(app)
        .post("/user/login")
        .send({
          username: "wrongUsername",
          password: newUserData.password,
        })
        .expect(403);

      expect(msg).toBe(expectedErrorMessage);
    });
  });

  describe("When it receives a request with a wrong password", () => {
    test("Then it should respond with a 403 status code and a json with msg: 'Username or Password is wrong'", async () => {
      const expectedErrorMessage = "Username or Password is wrong";
      await User.create(newUserData);

      const {
        body: { msg },
      } = await request(app)
        .post("/user/login")
        .send({
          username: newUserData.username,
          password: "wrong password",
        })
        .expect(403);

      expect(msg).toBe(expectedErrorMessage);
    });
  });

  describe("When it receives a request with wrong properties", () => {
    test("Then it should respond with a 400 status code", async () => {
      const expectedErrorMessage = "Bad request";

      await User.create(newUserData);

      const {
        body: { msg },
      } = await request(app)
        .post("/user/login")
        .send({ wrong: "wrong" })
        .expect(400);

      expect(msg).toBe(expectedErrorMessage);
    });
  });
});
