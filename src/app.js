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
  console.log("Cliente conectado");
  socket.on("mensaje", (info) => {
    console.log(info);
  });
  socket.on("user", (info) => {
    console.log(info);
    socket.emit("confirmacionAcceso", "Acceso permitido");
  });
  //Mensaje que se envia a los clientes conectados a otros sockets
  socket.broadcast.emit("mensaje-socket-propio", "Datos jugadores");
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
// app.get("/", (req, res) => {
//   const tutor = {
//     nombre: "Luciana",
//     email: "lu@lu.com",
//     rol: "Tutor",
//   };
//   const cursos = [
//     {
//       numero: "123",
//       nombre: "Programacion Backend",
//       dia: "LyM",
//       horario: "Noche",
//     },
//     { numero: "456", nombre: "React", dia: "S", horario: "Mañana" },
//     { numero: "789", nombre: "Angular", dia: "MyJ", horario: "Tarde" },
//   ];
//   res.render("home", {
//     titulo: "Plataforma CoderHouse 51225",
//     mensaje: "Hola buenos dias",
//     user: tutor,
//     isTutor: tutor.rol === "Tutor",
//     cursos: cursos,
//   });
// });
app.get("/", async (req, res) => {
  let products = await productManager.getProducts();
  res.render("home", {
    titulo: "HOME - TODOS LOS PRODUCTOS",
    products: products,
  });
});
