const fs = require("fs");
const path = require("path");
const firebase = require("./firebase");

jest.mock("firebase/storage", () => ({
  ref: jest.fn().mockReturnValue("avatarRef"),
  uploadBytes: jest.fn().mockResolvedValue({}),
  getStorage: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("firebaseFileURL"),
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
      jest
        .spyOn(path, "join")
        .mockReturnValue(`${path.join("uploads", "images")}`);

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldPath, newPath, callback) => {
          callback("renameError");
        });

      jest.spyOn(fs, "readFile").mockImplementation((pathToRead, callback) => {
        callback();
      });

      const next = jest.fn();
      const req = {
        file: { filename: "filename", originalname: "filename" },
      };

      await firebase(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with file and readFile throw error", () => {
    test("Then it should call next", async () => {
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
