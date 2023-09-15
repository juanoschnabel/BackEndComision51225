//IMPORTACIONES
import { cartModel } from "../models/Cart.js";
import { productModel } from "../models/Products.js";
import { ticketModel } from "../models/Ticket.js";
import { transporter } from "../utils/nodemailer.js";
class CartService {
  async getPurchase(req, res) {
    try {
      const userCart = req.user.cart.toString();
      const cid = req.params.cid;
      const buscarCarrito = await cartModel.findOne({ _id: cid });
      const buscarProductos = await productModel.find({
        _id: { $in: buscarCarrito.products.map((item) => item.id_prod) },
      });
      const productosEnCarrito = [];
      for (const item of buscarCarrito.products) {
        const productoEncontrado = buscarProductos.find(
          (producto) => producto._id.toString() === item.id_prod.toString()
        );
        if (productoEncontrado) {
          const subtotal = item.quantity * productoEncontrado.price;

          const productoConCantidad = {
            ...productoEncontrado.toObject(),
            cantidad: item.quantity,
            subtotal: subtotal,
          };

          productosEnCarrito.push(productoConCantidad);
        }
      }

      let total = 0;
      for (const item of buscarCarrito.products) {
        const producto = buscarProductos.find(
          (prod) => prod._id.toString() === item.id_prod.toString()
        );
        if (producto) {
          const subtotal = producto.price * item.quantity;
          total += subtotal;
        }
      }
      const totalParse = Number(total);
      res.render("carrito", {
        titulo: "Tu carrito",
        carrito: buscarCarrito.products,
        productos: productosEnCarrito,
        total: total,
        continuar: totalParse > 0,
        userCart,
      });
    } catch (error) {
      return error;
    }
  }
  async postPurchase(req, res) {
    try {
      const total = req.body.total;
      const email = req.user.email;
      const carrito = await cartModel.findById(req.user.cart.toString());
      const buscarProductos = await productModel.find({
        _id: { $in: carrito.products.map((item) => item.id_prod) },
      });
      const productosComprados = buscarProductos.map(
        (producto) => producto.title
      );
      await ticketModel.create({
        amount: total,
        purchaser: email,
      });
      await transporter.sendMail({
        to: email,
        subject: "Compra Exitosa en Ecommerce",
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  padding: 20px;
                }
                .container {
                  background-color: #ffffff;
                  border-radius: 5px;
                  padding: 20px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #333;
                }
                p {
                  color: #555;
                }
                ul {
                  list-style: none;
                  padding: 0;
                }
                li {
                  margin-bottom: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>¡Compra Exitosa en Ecommerce!</h1>
                <p>Tu compra ha sido realizada con éxito. A continuación, se detallan los productos y el monto final de tu compra:</p>
                <ul>
                  <li><strong>Productos Comprados:</strong></li>
                  ${productosComprados
                    .map((producto) => `<li>${producto}</li>`)
                    .join("")}
                </ul>
                <p><strong>Monto Total:</strong> $${total}</p>
                <p>Gracias por comprar en Ecommerce.</p>
              </div>
            </body>
          </html>
        `,
      });

      await cartModel.updateOne({ _id: carrito._id }, { products: [] });
      res.render("ticket", {
        productosComprados,
      });
    } catch (error) {
      return error;
    }
  }
  async getCart(req, res) {
    try {
      const carts = await cartModel.find();
      const cartList = carts.map(({ _id, products }) => ({
        id: _id,
        products: products,
      }));
      res.render("carts", {
        titulo: "Gestionar Carritos",
        carts: cartList,
      });
    } catch (error) {
      return error;
    }
  }
  async postCart(req, res) {
    try {
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
    } catch (error) {
      return error;
    }
  }
}

export const cartService = new CartService();
