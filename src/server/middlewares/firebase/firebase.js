const debug = require("debug")("padelbookings:server:firebase");
const chalk = require("chalk");
const { initializeApp } = require("firebase/app");
const path = require("path");
const fs = require("fs");
const {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref,
} = require("firebase/storage");

const firebase = async (req, res, next) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAtkxRzVeyXKyRrTVGjpaQbO1pNx9DU8b8",
    authDomain: "padelbookings-75152.firebaseapp.com",
    projectId: "padelbookings-75152",
    storageBucket: "padelbookings-75152.appspot.com",
    messagingSenderId: "226596812228",
    appId: "1:226596812228:web:1ab07f4dcad13a52682091",
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const { file } = req;

  const newFileName = file ? `${Date.now()}${file.originalname}` : "";
  try {
    if (file) {
      fs.rename(
        path.join("uploads", "images", file.filename),
        path.join("uploads", "images", newFileName),
        async (error) => {
          if (error) {
            debug(chalk.red("Error renaming profile picture file"));

            next(error);
            return;
          }
          req.body.profilePicture = newFileName;

          fs.readFile(
            path.join("uploads", "images", newFileName),
            async (readError, readFile) => {
              if (readError) {
                debug(chalk.red("Error reading post picture"));

                next(readError);
                return;
              }
              const storage = getStorage(firebaseApp);

              const storageRef = ref(storage, newFileName);
              await uploadBytes(storageRef, readFile);
              const firebaseFileURL = await getDownloadURL(storageRef);

              req.body.profilePictureBackup = firebaseFileURL;

              next();
            }
          );
        }
      );
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = firebase;
