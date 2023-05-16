import express from "express";
import productRouter from "./routes/product.routes.js";
import { __dirname } from "./path.js";
import multer from "multer";
import cartRouter from "./routes/cart.routes.js";
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";
import { ProductManager } from "./ProductManager.js";
import { MessagesManager } from "./MessagesManager.js";
import mongoose from "mongoose";
import { userModel } from "./models/user.js";
import "dotenv/config";
import { CartManager } from "./CartManager.js";
// const productManager = new ProductManager("./info.txt");
const productManager = new ProductManager(
  process.env.URL_MONGODB_ATLAS,
  "mydatabase",
  "products"
);
const cartManager = new CartManager(
  process.env.URL_MONGODB_ATLAS,
  "mydatabase",
  "carts"
);
const messagesManager = new MessagesManager(
  process.env.URL_MONGODB_ATLAS,
  "mydatabase",
  "messages"
);

//CONFIGURACIONES
const app = express();
mongoose
  .connect(process.env.URL_MONGODB_ATLAS)
  .then(() => console.log("DB is connected"))
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
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
//PUERTO
const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
//MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const upload = multer({ storage: storage });
//ServerIO
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("cliente conectado");
  socket.on("nuevoMensaje", async ([data]) => {
    const user = data.user;
    const mensaje = data.message;
    await messagesManager.addMessage(user, mensaje);
  });
  socket.on("productoIngresado", async ([info]) => {
    const title = info.title;
    const description = info.description;
    const price = info.price;
    const thumbnail = info.thumbnail;
    const code = info.code;
    const status = info.status;
    const stock = info.stock;
    const category = info.category;
    await productManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      stock,
      category
    );
    const newProducts = await productManager.getProducts();

    io.emit("nuevosproductos", newProducts);
  });

  socket.on("productoEliminado", async (id) => {
    await productManager.deleteProduct(id);
    const newProducts = await productManager.getProducts();
    io.emit("nuevosproductos", newProducts);
  });
});

//ROUTES
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", express.static(__dirname + "/public"));
app.post("/upload", upload.single("product"), (req, res) => {
  //IMAGENES
  console.log(req.body);
  console.log(req.file);
  res.send("imagen subida");
});
//HBS
app.get("/", async (req, res) => {
  let products = await productManager.getProducts();
  res.render("home", {
    titulo: "HOME - TODOS LOS PRODUCTOS",
    products: products,
  });
});
app.get("/chat", (req, res) => {
  res.render("index", {
    titulo: "chat",
  });
});
app.get("/realtimeproducts", async (req, res) => {
  const getProducts = await productManager.getProducts();
  res.render("realTimeProducts", {
    titulo: "real time products",
    products: getProducts,
  });
});
