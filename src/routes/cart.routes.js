//IMPORTACIONES
import mongoose from "mongoose";
import { Router } from "express";
import { cartModel } from "../models/Cart.js";

//RUTEO
const cartRouter = Router();
//RUTAS
cartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    const parsedQuantity = parseInt(quantity);
    const cart = await cartModel.findById({ _id: cid });
    const addProductToCart = {
      id_prod: pid,
      quantity: parsedQuantity,
    };
    cart.products.push(addProductToCart);
    await cart.save();
    console.log(cart);
    console.log(addProductToCart);
    res.send("producto añadido correctamente");
  } catch (error) {
    console.log(error);
  }
});
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const cart = await cartModel.findByIdAndUpdate(
    { _id: cid },
    { $pull: { products: { id_prod: pid } } },
    { new: true }
  );
  if (cart) {
    res.send("producto eliminado correctamente");
  } else {
    res.status(404).send("producto no encontrado en el carrito");
  }
});
cartRouter.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartModel.findByIdAndUpdate(
    { _id: cid },
    { $unset: { products: "" } },
    { new: true }
  );
  if (cart) {
    res.send("todos los productos eliminados correctamente");
  } else {
    res.status(404).send("carrito no encontrado");
  }
});
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;
  const cart = await cartModel.findById({ _id: cid });
  const productIndex = cart.products.findIndex(
    (product) =>
      product.id_prod.toString() === new mongoose.Types.ObjectId(pid).toString()
  );
  if (productIndex !== -1) {
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    res.send("cantidad de producto actualizado correctamente");
  } else {
    res.status(404).send("producto no encontrado en el carrito");
  }
});
cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body || {};
  if (!products) {
    return res.status(400).send({ message: "Producto no encontrado" });
  }
  const parsedProducts = products.map((product) => ({
    id_prod: new mongoose.Types.ObjectId(product.id_prod),
    quantity: product.quantity,
  }));
  const cart = await cartModel.findByIdAndUpdate(
    cid,
    { products: parsedProducts },
    { new: true }
  );
  res.send(cart);
});
cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartModel.findById(cid).populate("products.id_prod");
  res.send(cart.products);
});

export default cartRouter;
