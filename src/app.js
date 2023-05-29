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

//CONFIGURACIONES
const app = express();
mongoose
  .connect(process.env.URL_MONGODB_ATLAS)
  .then(() => {
    console.log("DB is connected");
  })
  .catch((error) => console.log("Error en MongoDB Atlas :", error));
// await cartModel.create([{}]);
// await productModel.create([
//   {
//     title: "Product 46",
//     description: "Description for Product 46",
//     code: "CODE46",
//     category: "Category 4",
//     price: 145,
//     stock: 145,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 47",
//     description: "Description for Product 47",
//     code: "CODE47",
//     category: "Category 4",
//     price: 146,
//     stock: 146,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 48",
//     description: "Description for Product 48",
//     code: "CODE48",
//     category: "Category 4",
//     price: 147,
//     stock: 147,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 49",
//     description: "Description for Product 49",
//     code: "CODE49",
//     category: "Category 4",
//     price: 148,
//     stock: 148,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 50",
//     description: "Description for Product 50",
//     code: "CODE50",
//     category: "Category 4",
//     price: 149,
//     stock: 149,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 51",
//     description: "Description for Product 51",
//     code: "CODE51",
//     category: "Category 5",
//     price: 150,
//     stock: 150,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 52",
//     description: "Description for Product 52",
//     code: "CODE52",
//     category: "Category 5",
//     price: 151,
//     stock: 151,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 53",
//     description: "Description for Product 53",
//     code: "CODE53",
//     category: "Category 5",
//     price: 152,
//     stock: 152,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 54",
//     description: "Description for Product 54",
//     code: "CODE54",
//     category: "Category 5",
//     price: 153,
//     stock: 153,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 55",
//     description: "Description for Product 55",
//     code: "CODE55",
//     category: "Category 5",
//     price: 154,
//     stock: 154,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 56",
//     description: "Description for Product 56",
//     code: "CODE56",
//     category: "Category 1",
//     price: 155,
//     stock: 155,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 57",
//     description: "Description for Product 57",
//     code: "CODE57",
//     category: "Category 1",
//     price: 156,
//     stock: 156,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 58",
//     description: "Description for Product 58",
//     code: "CODE58",
//     category: "Category 1",
//     price: 157,
//     stock: 157,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 59",
//     description: "Description for Product 59",
//     code: "CODE59",
//     category: "Category 1",
//     price: 158,
//     stock: 158,
//     status: true,
//     thumbnail: ["hola"],
//   },
//   {
//     title: "Product 60",
//     description: "Description for Product 60",
//     code: "CODE60",
//     category: "Category 1",
//     price: 159,
//     stock: 159,
//     status: true,
//     thumbnail: ["hola"],
//   },
// ]);
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
// const io = new Server(server);
// io.on("connection", (socket) => {
//   console.log("cliente conectado");
//   socket.on("nuevoCarrito", async (data) => {
//     await cartManager.createCarrito(data);
//     const newCarts = await cartManager.getCarts();
//     io.emit("nuevosCarritos", newCarts);
//   });

//   socket.on("nuevoMensaje", async ([data]) => {
//     const user = data.user;
//     const mensaje = data.message;
//     await messagesManager.addMessage(user, mensaje);
//     const newMessage = await messagesManager.getMessages();
//     io.emit("nuevosMensajes", newMessage);
//   });
//   socket.on("productoIngresado", async ([info]) => {
//     const title = info.title;
//     const description = info.description;
//     const price = info.price;
//     const thumbnail = info.thumbnail;
//     const code = info.code;
//     const status = info.status;
//     const stock = info.stock;
//     const category = info.category;
//     await productManager.addProduct(
//       title,
//       description,
//       price,
//       thumbnail,
//       code,
//       status,
//       stock,
//       category
//     );
//     const newProducts = await productManager.getProducts();

//     io.emit("nuevosproductos", newProducts);
//   });

//   socket.on("productoEliminado", async (id) => {
//     await productManager.deleteProduct(id);
//     const newProducts = await productManager.getProducts();
//     io.emit("nuevosproductos", newProducts);
//   });
// });

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
// app.get("/", async (req, res) => {
//   let products = await productManager.getProducts();
//   res.render("home", {
//     titulo: "HOME - TODOS LOS PRODUCTOS",
//     products: products,
//   });
// });
// app.get("/chat", async (req, res) => {
//   const messages = await messagesManager.getMessages();
//   res.render("chat", {
//     titulo: "chat",
//     messages: messages,
//   });
// });
// app.get("/realtimeproducts", async (req, res) => {
//   const getProducts = await productManager.getProducts();
//   res.render("realTimeProducts", {
//     titulo: "real time products",
//     products: getProducts,
//   });
// });
// app.get("/carts", async (req, res) => {
//   const carts = await cartManager.getCarts();
//   res.render("carts", {
//     titulo: "carts",
//     carts: carts,
//   });
// });
