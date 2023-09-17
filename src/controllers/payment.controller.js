import Stripe from "stripe";
import { cartModel } from "../models/Cart.js";
import config from "../utils/config.js";
import { productModel } from "../models/Products.js";
const stripe = new Stripe(config.STRIPE_KEY);
export const createSession = async (req, res) => {
  // console.log(req.body);
  const total = req.params.total;
  const cid = req.params.cid;
  // const buscarCarrito = await cartModel.findOne({ _id: cid });
  // const idProductosCarrito = buscarCarrito.products.map((item) => item.id_prod);
  // const traerProductos = await productModel.find({
  //   _id: { $in: idProductosCarrito },
  // });
  // const productosConInfo = buscarCarrito.products.map((item) => {
  //   const productoEncontrado = traerProductos.find((producto) =>
  //     producto._id.equals(item.id_prod)
  //   );
  //   return {
  //     title: productoEncontrado.title,
  //     quantity: item.quantity,
  //   };
  // });
  // const buscarProductos = await productModel.find({
  //   _id: { $in: buscarCarrito.products.map((item) => item.id_prod) },
  // });
  // console.log(productosConInfo);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: { name: "TOTAL" },
          currency: "BRL",
          unit_amount: Number(total * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `http://localhost:8080/api/cart/${cid}/${total}/ticket`,
    cancel_url: `http://localhost:8080/api/cart/${cid}/purchase`,
  });
  return res.redirect(session.url);
};

// import Stripe from "stripe";

// export default class PaymentService {
//   constructor() {
//     this.stripe = new Stripe(
//       "sk_test_51NqeOULKTFMp6o6iJrH7zedw7npRUfw6ystV0seIgGugdz2D4Hgd15ejesml6bDXrTAZ8BeNk7FJUyPwx6hmLC1X008lCXLw3y"
//     );
//   }
//   createPaymentIntent = async (data) => {
//     const paymentIntent = this.stripe.paymentIntents.create(data);
//     return paymentIntent;
//   };
// }
