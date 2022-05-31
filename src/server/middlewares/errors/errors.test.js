const { notFoundError, generalError } = require("./errors");

const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
let expectedStatusCode;

describe("Given a notFoundError function", () => {
  describe("When its called with a response", () => {
    test("Then it should call response's methods status with 404, and json with an object with property errorMessage 'Endpoint not found'", () => {
      expectedStatusCode = 404;
      const expectedJson = { msg: "Endpoint not found" };

      notFoundError(null, res);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });
});

describe("Given a generalError function", () => {
  describe("When its called with a generic error, and a response", () => {
    test("Then it should call res status method with a 500 and json method with an object with ErrorMessage 'General error'", () => {
      expectedStatusCode = 500;
      const messageText = "General error";
      const expectedJson = { msg: messageText };
      const customError = new Error();

      generalError(customError, null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });

  describe("When its called with an error with code 409 and message 'Conflict', and a response", () => {
    test("Then it should call res status method with a 409 and json method with an object with ErrorMessage 'Conflict'", () => {
      expectedStatusCode = 409;
      const messageText = "Conflict";
      const expectedJson = { msg: messageText };
      const error = new Error();
      error.statusCode = expectedStatusCode;
      error.customMessage = messageText;

      generalError(error, null, res, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(res.json).toHaveBeenCalledWith(expectedJson);
    });
  });
});
