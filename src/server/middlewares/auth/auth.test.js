const jwt = require("jsonwebtoken");
const auth = require("./auth");

describe("Given an auth function", () => {
  describe("When it receives a request with a valid token", () => {
    test("Then it should call next and add the property userId with the id inluded in the token to the request", () => {
      const req = {
        headers: { authorization: "Bearer " },
      };
      const next = jest.fn();
      const mockId = { id: 999 };
      jwt.verify = jest.fn().mockReturnValue(mockId);

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
      expect(req).toHaveProperty("userId", 999);
    });
  });

  describe("When it receives a request with an invalid token", () => {
    test("Then it should call next with an error", () => {
      const req = {
        headers: {
          authorization: "12345 vearer",
        },
      };
      const next = jest.fn();

      auth(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
