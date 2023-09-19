import { productModel } from "../models/Products.js";
import { cartModel } from "../models/Cart.js";
import { transporter } from "../utils/nodemailer.js";
import { userModel } from "../models/Users.js";

class ProductsService {
  async getProducts(req, res) {
    try {
      const user = req.user;
      const userId = req.user._id;
      const cart = user.cart.toString();
      const getProducts = await productModel.find({ userId: { $ne: userId } });
      const products = getProducts.map(
        ({
          title,
          description,
          price,
          thumbnail,
          code,
          category,
          stock,
          status,
          _id,
        }) => ({
          title,
          description,
          price,
          thumbnail,
          code,
          category,
          stock,
          status,
          _id,
        })
      );
      const profile = {
        first_name: user.first_name,
        last_name: user.last_name,
        cart,
      };

      res.status(200).render("home", {
        titulo: "HOME - TODOS LOS PRODUCTOS",
        products: products,
        user: profile,
        verProductos: user.role === "premium" || user.role === "user",
        isAdmin: user.role === "admin",
        isUser: user.role === "user",
        isPremium: user.role === "premium",
      });
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
  async addProduct(req, res) {
    try {
      async function productList(type, title, productId, quantity) {
        const updatedStock = buscarProducto.stock - quantity;
        await productModel.findOneAndUpdate(
          { _id: productId },
          { stock: updatedStock }
        );
        const userId = req.user._id;
        const getProducts = await productModel.find({
          userId: { $ne: userId },
        });
        const products = getProducts.map(
          ({
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status,
            _id,
          }) => ({
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status,
            _id,
          })
        );
        const profile = {
          first_name: req.user.first_name,
          last_name: req.user.last_name,
          cart: req.user.cart,
          role: req.user.role,
          userId: req.user._id,
        };
        res.render("home", {
          titulo: "HOME - TODOS LOS PRODUCTOS",
          products: products,
          user: profile,
          verProductos: profile.role === "premium" || profile.role === "user",
          isAdmin: profile.role === "admin",
          isUser: profile.role === "user",
          isPremium: profile.role === "premium",
          alertMessage: true,
          type: type,
          title: title,
        });
      }
      const { quantity, id_prod } = req.body;
      let cart = req.user.cart;
      cart = cart.toString();
      const buscarCarrito = await cartModel.findOne({ _id: cart });
      const buscarProducto = await productModel.findOne({ _id: id_prod });
      const resultado = buscarCarrito.products.find(
        (objeto) => objeto.id_prod.toString() === id_prod
      );
      try {
        if (buscarCarrito && buscarProducto && resultado) {
          await cartModel.findOneAndUpdate(
            { _id: cart, "products.id_prod": id_prod },
            { $inc: { "products.$.quantity": quantity } }
          );
          productList(
            "success",
            "CANTIDAD DE PRODUCTO MODIFICADO EXITOSAMENTE",
            id_prod,
            quantity
          );
          return;
        } else if (buscarCarrito && buscarProducto) {
          const nuevoProducto = {
            id_prod,
            quantity,
          };
          await cartModel.findOneAndUpdate(
            { _id: cart },
            { $push: { products: nuevoProducto } }
          );
          productList(
            "success",
            "PRODUCTO AÑADIDO AL CARRITO EXITOSAMENTE",
            id_prod,
            quantity
          );
          return;
        }
      } catch (error) {
        productList("error", "OCURRIÓ UN ERROR. INTENTE NUEVAMENTE");
        return error;
      }
    } catch (error) {
      return error;
    }
  }
  async getRealTimeProducts(req, res) {
    try {
      const isAdmin = req.user.role;
      const userId = req.user._id;
      let getProducts;
      if (req.user.role != "admin") {
        getProducts = await productModel.find({
          userId: { $eq: userId },
        });
      } else {
        getProducts = await productModel.find();
      }

      const products = getProducts.map(
        ({
          title,
          description,
          price,
          thumbnail,
          code,
          category,
          stock,
          status,
          _id,
        }) => ({
          title,
          description,
          price,
          thumbnail,
          code,
          category,
          stock,
          status,
          _id,
        })
      );

      res.render("realTimeProducts", {
        titulo: "GESTIÓN DE PRODUCTOS GET",
        products: products,
        isAdmin: isAdmin === "admin",
      });
    } catch (error) {
      return error;
    }
  }
  async postRealTimeProducts(req, res) {
    try {
      const isAdmin = req.user.role;
      const userId = req.user._id;
      async function productList(type, title) {
        let getProducts;
        if (isAdmin === "premium") {
          getProducts = await productModel.find({
            userId: { $eq: userId },
          });
        }
        if (isAdmin === "admin") {
          getProducts = await productModel.find();
        }
        const products = getProducts.map(
          ({
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status,
            _id,
          }) => ({
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status,
            _id,
          })
        );
        res.render("realTimeProducts", {
          titulo: "GESTIÓN DE PRODUCTOS",
          products: products,
          alertMessage: true,
          type: type,
          title: title,
          isAdmin: isAdmin === "admin",
        });
      }
      try {
        if (req.body.borrar) {
          const productId = req.body.borrar;
          const product = await productModel.find({ _id: productId });
          const { title, _id, userId } = product;
          const user = await userModel.find({ _id: userId });
          const { email, first_name, last_name } = user[0];
          await productModel.deleteOne({ _id: productId });
          await transporter.sendMail({
            to: email,
            subject: "Producto Eliminado",
            html: `
              <html>
                <head>
                  <style>
                    /* Agrega estilos CSS aquí para dar formato al correo electrónico */
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
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>¡Producto Eliminado!</h1>
                    <p>Hola ${first_name} ${last_name},</p>
                    <p>Un producto tuyo fue eliminado de nuestro catálogo!.</p>
                    <p>Se trata de ${title}.</p>
                    <p>Su ID era: ${_id}.</p>
                  </div>
                </body>
              </html>
            `,
          });

          productList("success", "PRODUCTO ELIMINADO EXITOSAMENTE");
        } else {
          const {
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status,
          } = req.body;
          const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            stock,
            status,
            userId,
          };
          const product = new productModel(newProduct);
          await product.save();
          productList("success", "PRODUCTO CREADO EXITOSAMENTE");
        }
      } catch (error) {
        productList("error", "OCURRIO UN ERROR! INTENTE NUEVAMENTE");
        return error;
      }
    } catch (error) {
      return error;
    }
  }
}

export const productService = new ProductsService();
