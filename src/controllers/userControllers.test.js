require("dotenv").config();
const bcrypt = require("bcrypt");

const User = require("../database/models/User");
const { userRegister } = require("./userControllers");

const mockNewUser = {
  username: "john",
  password: "smith99",
  _id: "fakeid1991239",
};

jest.mock("../database/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(() => mockNewUser),
}));

jest.mock("bcrypt", () => ({ hash: jest.fn() }));

const mockNext = jest.fn();

describe("Given a register user function", () => {
  describe("When it is called and the request has valid new user data", () => {
    test("Then it should call the response's methods status with a 201, and json with the username", async () => {
      const req = {
        body: { username: "john", password: "smith99" },
      };

      User.findOne.mockImplementation(() => false);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedStatus = 201;
      const expectedJson = { username: "john" };
      bcrypt.hash.mockImplementation(() => "smith99HashedPassword");
      await userRegister(req, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When it is called and the request has an existing username", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        body: { username: "Repeated User", password: "smith99" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockImplementation(() => true);
      bcrypt.hash.mockImplementation(() => "smith99HashedPassword");

      await userRegister(req, res, mockNext);
      const expectedError = new Error();

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it is called with a bad request", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        body: { MyNameIsThis: "Repeated User", password: "smith99" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedError = new Error();

      User.findOne = jest.fn().mockRejectedValue(expectedError);

      await userRegister(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });
});
