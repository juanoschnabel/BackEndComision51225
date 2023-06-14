import express from "express";
import productRouter from "./routes/product.routes.js";
import { __dirname } from "./path.js";
import multer from "multer";
import cartRouter from "./routes/cart.routes.js";
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { productModel } from "./models/Products.js";
import { cartModel } from "./models/Cart.js";
import "dotenv/config";
// import "./utils/bcrypt.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import sessionRouter from "./routes/session.router.js";

//CONFIGURACIONES
const fileStore = FileStore(session);
const app = express();
mongoose
  .connect(process.env.URL_MONGODB_ATLAS, {
    dbName: "ecommerce",
  })
  .then(() => {
    console.log("DB is connected");
  })
  .catch((error) => console.log("Error en MongoDB Atlas :", error));

const PORT = 8080;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
app.engine("handlebars", engine());
app.set("views", path.resolve(__dirname, "./views"));
app.set("view engine", "handlebars");
//PUERTO
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
//MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const upload = multer({ storage: storage });
app.use(cookieParser());
//ServerIO

//HBS

// app.use(
//   session({
//     store: new fileStore({
//       path: process.env.URL_MONGODB_ATLAS,
//     }),
//     secret: "mysecret",
//     resave: true,
//     saveUninitialized: true,
//   })
// );
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.URL_MONGODB_ATLAS,
      dbName: "ecommerce",
      collectionName: "cookies",
      // mongoOptions: {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // },
    }),
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);

//ROUTES
app.use("/sessions", sessionRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", express.static(__dirname + "/public"));
app.post("/upload", upload.single("product"), (req, res) => {
  //IMAGENES
  console.log(req.body);
  console.log(req.file);
  res.send("imagen subida");
});
