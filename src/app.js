import express from "express";
// import "dotenv/config";
import "./passport/passportStrategies.js";
import productRouter from "./routes/product.routes.js";
import sessionRouter from "./routes/session.router.js";
import cartRouter from "./routes/cart.routes.js";
import { __dirname } from "./config/path.js";
import { engine } from "express-handlebars";
import * as path from "path";
import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
import MongoStore from "connect-mongo";
// import multer from "multer";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import config from "./utils/config.js";
import "./config/configDB.js";
//CONFIGURACIONES
const app = express();
// mongoose
//   .connect(config.URL_MONGODB_ATLAS, {
//     dbName: "ecommerce",
//   })
//   .then(() => {
//     console.log("DB is connected");
//   })
//   .catch((error) => console.log("Error en MongoDB Atlas :", error));
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "src/public/img");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.originalname}`);
//   },
// });
app.engine("handlebars", engine());
app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "handlebars");
//PUERTO
const server = app.listen(config.PORT, () => {
  console.log(`Server on port ${config.PORT}`);
});
//MIDDLEWARES
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// const upload = multer({ storage: storage });
app.use(cookieParser());
//HBS
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.URL_MONGODB_ATLAS,
      dbName: "ecommerce",
      collectionName: "cookies",
    }),
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);
//PASPORT
app.use(passport.initialize());
app.use(passport.session());
//ROUTES
app.use("/sessions", sessionRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", express.static(__dirname + "/public"));
// app.post("/upload", upload.single("product"), (req, res) => {
//   //IMAGENES
//   console.log(req.body);
//   console.log(req.file);
//   res.send("imagen subida");
// });
app.get("/", async (req, res) => {
  res.render("sessions/login");
});
