const fs = require("fs");
const path = require("path");
const firebase = require("./firebase");

jest.mock("firebase/storage", () => ({
  ref: jest.fn().mockReturnValue("avatarRef"),
  uploadBytes: jest.fn().mockResolvedValue({}),
  getStorage: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("url"),
}));

describe("Given a firebase middleware", () => {
  describe("When it receives a request without a file", () => {
    test("Then it should call next", async () => {
      const req = { file: null };

      const next = jest.fn();
      await firebase(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When the rename method fails", () => {
    test("Then it should call the received next function with the error 'renameError'", async () => {
      const req = { file: { filename: "file" } };

      jest
        .spyOn(path, "join")
        .mockReturnValue(`${path.join("uploads", "images")}`);

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback("renameError");
        });

      const next = jest.fn();
      await firebase(req, null, next);

      expect(next).toHaveBeenCalledWith("renameError");
    });
  });

  describe("When the readFile method fails", () => {
    test("Then it should call the received next function with the error 'readFileError'", async () => {
      const expectedError = "Error reading file";
      jest
        .spyOn(path, "join")
        .mockReturnValue(`${path.join("uploads", "images")}`);

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      jest.spyOn(fs, "readFile").mockImplementation((pathToRead, callback) => {
        callback(expectedError);
      });
      const next = jest.fn();
      const req = { body: {}, file: { originalname: "picture1.jpg" } };

      await firebase(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
