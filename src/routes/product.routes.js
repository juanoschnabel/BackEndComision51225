import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
const productManager = new ProductManager("./info.txt");
const productRouter = Router();
// const socket = io();
productRouter.get("/", async (req, res) => {
  let products = await productManager.getProducts();
  const { limit } = req.query;
  const newLimit = Number(limit);
  if (limit) {
    products = products.slice(0, newLimit);
    res.render("home", {
      titulo: `${newLimit} productos mostrados`,
      products: products,
    });
  } else {
    res.render("home", {
      titulo: `HOME - Todos los productos`,
      products: products,
    });
  }
});
productRouter.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  res.render("product", {
    titulo: "Product / filtrado por Id",
    title: product.title,
    description: product.description,
    price: product.price,
    code: product.code,
    stock: product.stock,
    thumbnail: product.thumbnail,
    category: product.category,
    status: product.status,
    existe: product != false,
    mensaje: "Producto no encontrado",
    id: product.id,
  });
});
// const io = new Server(server);
// const mensajes = await productManager.getProducts();
// io.on("connection", (socket) => {
//   console.log("cliente conectado");
//   socket.on("mensaje", (info) => {
//     console.log(info);
//     mensajes.push(info);
//     io.emit("mensajes", mensajes);
//   });
// });
productRouter.get("/realtimeproducts", async (req, res) => {
  let products = await productManager.getProducts();
  res.render("realTimeProducts", {
    titulo: `HOME - Todos los productos`,
    products: products,
  });
});
productRouter.post("/realtimeproducts", async (req, res) => {
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category,
  } = req.body;
  const result = await productManager.addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category
  );
  let products = await productManager.getProducts();
  if (result === null) {
    // res.send("Producto creado exitosamente");
    // res.render("realTimeProducts", {
    //   titulo: "real time products",
    //   title: products.title,
    //   description: products.description,
    //   price: products.price,
    //   code: products.code,
    //   stock: products.stock,
    //   thumbnail: products.thumbnail,
    //   category: products.category,
    //   status: products.status,
    //   id: products.id,
    //   mensaje: "producto creado exitosamente",
    // });

    res.render("realTimeProducts", {
      titulo: `real time products`,
      products: products,
    });
    socket.emit("mensaje", {
      titulo: `real time products`,
      products: products,
    });
  } else {
    // res.send(result);
    // res.render("realTimeProducts", {
    //   titulo: "real time products",
    //   mensaje: `${result}`,
    // });
    res.render("realTimeProducts", {
      titulo: `real time products`,
      products: products,
    });
    socket.emit("mensaje", {
      titulo: result.title,
      descripcion: result.description,
      precio: result.price,
      categoria: result.category,
      stock: result.stock,
      status: result.status,
      imagen: result.thumbnail,
      codigo: result.code,
      id: result.id,
    });
  }
});

productRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const {
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category,
  } = req.body;
  const mensaje = await productManager.updateProduct(id, {
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    stock,
    category,
  });

  res.send(mensaje);
});
productRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const mensaje = await productManager.deleteProduct(id);
  res.send(mensaje);
});
export default productRouter;
