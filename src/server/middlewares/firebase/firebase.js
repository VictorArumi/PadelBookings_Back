const fs = require("fs");
const path = require("path");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");

const firebase = async (req, res, next) => {
  const firebaseConfig = {
    apiKey: "AIzaSyAozs25IxSHFCKJVb-KZZNazikPO3hg8z0",
    authDomain: "tootattoo-images.firebaseapp.com",
    projectId: "tootattoo-images",
    storageBucket: "tootattoo-images.appspot.com",
    messagingSenderId: "617428563723",
    appId: "1:617428563723:web:35f6da80e29b4a4879540e",
  };

  const app = initializeApp(firebaseConfig);

  const { file } = req;

  const newPicture = file ? `${Date.now()}${file.originalname}` : "";

  try {
    if (!file) {
      req.profilePicture = "";
      req.profilePictureBackup = "";
      next();
    } else {
      await fs.rename(
        path.join("uploads", "images", file.filename),
        path.join("uploads", "images", `${Date.now()}${file.originalname}`),
        async (error) => {
          if (error) {
            next(error);
          }

          await fs.readFile(
            path.join("uploads", "images", newPicture),
            async (readError, readFile) => {
              if (readError) {
                next(readError);
              }

              const storage = getStorage(app);
              const storageRef = ref(storage, newPicture);

              await uploadBytes(storageRef, readFile);

              const firebaseImageURL = await getDownloadURL(storageRef);

              req.profilePictureBackup = firebaseImageURL;
              req.profilePicture = path.join("uploads", "images", newPicture);

              next();
            }
          );
        }
      );
    }
  } catch {
    const error = new Error("Image backup unsuccesful");
    error.statusCode = 400;
    error.customMessage = "Image backup unsuccesful";

    next(error);
  }
};

module.exports = firebase;
