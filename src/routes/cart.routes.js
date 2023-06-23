//IMPORTACIONES
import mongoose from "mongoose";
import { Router } from "express";
import { cartModel } from "../models/Cart.js";
import { productModel } from "../models/Products.js";

//RUTEO
const cartRouter = Router();
// //RUTAS
cartRouter.get("/", async (req, res) => {
  const carts = await cartModel.find();
  const cartList = carts.map(({ _id, products }) => ({
    id: _id,
    products: products,
  }));
  res.render("carts", {
    titulo: "Gestionar Carritos",
    carts: cartList,
  });
});
cartRouter.post("/", async (req, res) => {
  async function cartList(type, title) {
    const carts = await cartModel.find();
    const cartList = carts.map(({ _id, products }) => ({
      id: _id,
      products: products,
      alertMessage: true,
    }));
    res.render("carts", {
      titulo: "Gestionar Carritos",
      carts: cartList,
      alertMessage: true,
      type: type,
      title: title,
    });
  }
  try {
    const buscarCarrito = await cartModel.findOne({ _id: req.body.idCart });
    const buscarProducto = await productModel.findOne({
      _id: req.body.idProduct,
    });
    if (req.body.crear) {
      const createCart = new cartModel();
      await createCart.save();
      cartList("success", "CARRITO CREADO EXITOSAMENTE");
    } else if (req.body.borrar) {
      const cartId = req.body.borrar;
      await cartModel.deleteOne({ _id: cartId });
      cartList("success", "CARRITO ELIMINADO EXITOSAMENTE");
    } else if (buscarCarrito && buscarProducto) {
      const updateCart = {
        products: [
          {
            id_prod: req.body.idProduct,
            quantity: req.body.quantity,
          },
        ],
      };
      await cartModel.findOneAndUpdate(
        { _id: req.body.idCart },
        { $push: { products: updateCart.products[0] } }
      );
      cartList("success", "PRODUCTO AGREGADO AL CARRITO EXITOSAMENTE!");
    }
  } catch (error) {
    cartList(
      "error",
      "Ocurrió un problema en la carga del carrito. Ingrese un Id de carrito y de productos válidos"
    );
    return error;
  }
});

// cartRouter.post("/:cid/products/:pid", async (req, res) => {
//   try {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const { quantity } = req.body;
//     const parsedQuantity = parseInt(quantity);
//     const cart = await cartModel.findById({ _id: cid });
//     const addProductToCart = {
//       id_prod: pid,
//       quantity: parsedQuantity,
//     };
//     cart.products.push(addProductToCart);
//     await cart.save();
//     console.log(cart);
//     console.log(addProductToCart);
//     res.send("producto añadido correctamente");
//   } catch (error) {
//     console.log(error);
//   }
// });
// cartRouter.delete("/:cid/products/:pid", async (req, res) => {
//   const cid = req.params.cid;
//   const pid = req.params.pid;
//   const cart = await cartModel.findByIdAndUpdate(
//     { _id: cid },
//     { $pull: { products: { id_prod: pid } } },
//     { new: true }
//   );
//   if (cart) {
//     res.send("producto eliminado correctamente");
//   } else {
//     res.status(404).send("producto no encontrado en el carrito");
//   }
// });
// cartRouter.delete("/:cid", async (req, res) => {
//   const cid = req.params.cid;
//   const cart = await cartModel.findByIdAndUpdate(
//     { _id: cid },
//     { $unset: { products: "" } },
//     { new: true }
//   );
//   if (cart) {
//     res.send("todos los productos eliminados correctamente");
//   } else {
//     res.status(404).send("carrito no encontrado");
//   }
// });
// cartRouter.put("/:cid/products/:pid", async (req, res) => {
//   const cid = req.params.cid;
//   const pid = req.params.pid;
//   const quantity = req.body.quantity;
//   const cart = await cartModel.findById({ _id: cid });
//   const productIndex = cart.products.findIndex(
//     (product) =>
//       product.id_prod.toString() === new mongoose.Types.ObjectId(pid).toString()
//   );
//   if (productIndex !== -1) {
//     cart.products[productIndex].quantity = quantity;
//     await cart.save();
//     res.send("cantidad de producto actualizado correctamente");
//   } else {
//     res.status(404).send("producto no encontrado en el carrito");
//   }
// });
// cartRouter.put("/:cid", async (req, res) => {
//   const { cid } = req.params;
//   const { products } = req.body || {};
//   if (!products) {
//     return res.status(400).send({ message: "Producto no encontrado" });
//   }
//   const parsedProducts = products.map((product) => ({
//     id_prod: new mongoose.Types.ObjectId(product.id_prod),
//     quantity: product.quantity,
//   }));
//   const cart = await cartModel.findByIdAndUpdate(
//     cid,
//     { products: parsedProducts },
//     { new: true }
//   );
//   res.send(cart);
// });
// cartRouter.get("/:cid", async (req, res) => {
//   const { cid } = req.params;
//   const cart = await cartModel.findById(cid).populate("products.id_prod");
//   res.send(cart.products);
// });

export default cartRouter;
