//IMPORTACIONES
import { Router } from "express";
import { CartManager } from "../CartManager.js";
//RUTEO
const cartManager = new CartManager("./carrito.txt");
const cartRouter = Router();
//RUTAS
cartRouter.get("/:cid", async (req, res) => {
  const product = await cartManager.getCartById(req.params.cid);
  res.send(product);
});
cartRouter.post("/", async (req, res) => {
  try {
    await cartManager.createCarrito();
    res.send("Carrito creado exitosamente");
  } catch (error) {
    res.send(error);
  }
});
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    await cartManager.addProductCart(
      req.params.pid,
      req.body.quantity,
      req.params.cid
    );
    res.send("Producto agregado al carrito exitosamente");
  } catch (error) {
    res.send(error);
  }
});

export default cartRouter;
