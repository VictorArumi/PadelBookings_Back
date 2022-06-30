const fs = require("fs");
const path = require("path");
const firebase = require("./firebase");

jest.mock("firebase/storage", () => ({
  ref: jest.fn().mockReturnValue("avatarRef"),
  uploadBytes: jest.fn().mockResolvedValue({}),
  getStorage: jest.fn(),
  getDownloadURL: jest.fn().mockResolvedValue("urlImageFirebase"),
}));

describe("Given a firebaseUpload middleware", () => {
  describe("When it's invoked without a file", () => {
    test("Then it should call the next function", async () => {
      const next = jest.fn();
      const req = {};

      await firebase(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with file and rename throw error", () => {
    test("Then it should call the next function", async () => {
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
    test("Then it should call the next function", async () => {
      jest
        .spyOn(path, "join")
        .mockReturnValue(`${path.join("uploads", "images")}`);

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldPath, newPath, callback) => {
          callback();
        });

      jest.spyOn(fs, "readFile").mockImplementation((pathToRead, callback) => {
        callback("readFileError");
      });

      const next = jest.fn();
      const req = {
        file: { filename: "filename", originalname: "filename" },
      };

      await firebase(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with file but rename fails", () => {
    test("Then it should call the next function", async () => {
      jest
        .spyOn(path, "join")
        .mockReturnValue(`${path.join("uploads", "images")}`);

      jest.spyOn(fs, "rename").mockRejectedValue();

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
});
