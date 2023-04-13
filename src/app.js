import { ProductManager } from "./ProductManager.js";
import express from "express";
const productManager = new ProductManager("./info.txt");
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get("/products", async (req, res) => {
  let products = await productManager.getProducts();
  const Newproducts = JSON.parse(products);
  const { limit } = req.query;
  const newLimit = Number(limit);
  if (limit) {
    const newArray = Newproducts.slice(0, newLimit);
    res.send(JSON.stringify(newArray));
  } else {
    res.send(JSON.stringify(products));
  }
});

app.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  res.send(product);
});
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
