import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
const productManager = new ProductManager("./info.txt");
const productRouter = Router();
productRouter.get("/", async (req, res) => {
  let products = await productManager.getProducts();
  const { limit } = req.query;
  const newLimit = Number(limit);
  if (limit) {
    const newArray = products.slice(0, newLimit);
    res.send(newArray);
  } else {
    res.send(products);
  }
});
productRouter.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  res.send(product);
});
productRouter.post("/", async (req, res) => {
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
  res.send("Producto creado exitosamente");
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
