import { Router } from "express";
import { ProductManager } from "../ProductManager.js";
const productManager = new ProductManager("./info.txt");
const productRouter = Router();
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
  if (result === null) {
    res.send("Producto creado exitosamente");
  } else {
    res.send(result);
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
