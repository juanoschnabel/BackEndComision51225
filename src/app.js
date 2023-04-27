import express from "express";
import productRouter from "./routes/product.routes.js";
import { __dirname } from "./path.js";
import multer from "multer";
import cartRouter from "./routes/cart.routes.js";
import { engine } from "express-handlebars";
import * as path from "path";
import { Server } from "socket.io";
import { ProductManager } from "./ProductManager.js";
const productManager = new ProductManager("./info.txt");
//CONFIGURACIONES
const app = express();
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
// app.get("/chat", (req, res) => {
//   res.render("index");
// });
app.get("/realtimeproducts", async (req, res) => {
  const getProducts = await productManager.getProducts();
  res.render("realTimeProducts", {
    titulo: "real time products",
    products: getProducts,
  });
});
