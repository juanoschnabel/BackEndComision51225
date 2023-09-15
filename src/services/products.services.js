import { productModel } from "../models/Products.js";
import { cartModel } from "../models/Cart.js";

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
        // Reducir el stock del producto
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
          // Si el producto ya existe en el carrito, actualiza la cantidad
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
      const userId = req.user._id;
      async function productList(type, title) {
        const getProducts = await productModel.find({
          userId: { $eq: userId },
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
        res.render("realTimeProducts", {
          titulo: "GESTIÓN DE PRODUCTOS",
          products: products,
          alertMessage: true,
          type: type,
          title: title,
        });
      }
      try {
        if (req.body.borrar) {
          const productId = req.body.borrar;
          await productModel.deleteOne({ _id: productId });
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
