import mongoose from "mongoose";
import config from "../utils/config.js";
import multer from "multer";
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();

mongoose
  .connect(config.URL_MONGODB_ATLAS, {
    dbName: "ecommerce",
  })
  .then(() => {
    console.log("DB is connected");
  })
  .catch((error) => console.log("Error en MongoDB Atlas :", error));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
app.post("/upload", upload.single("product"), (req, res) => {
  //IMAGENES
  console.log(req.body);
  console.log(req.file);
  res.send("imagen subida");
});
