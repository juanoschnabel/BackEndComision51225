import { Router } from "express";
import { productModel } from "../models/Products.js";
import { cartModel } from "../models/Cart.js";
const productRouter = Router();

productRouter.get("/errorLogin", (req, res) => {
  res.render("errorLogin");
});

productRouter.get("/", async (req, res) => {
  const user = req.user;
  const getProducts = await productModel.find();
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
  };
  function isAdmin() {
    const admin = user.role;
    if (admin === "user") {
      return false;
    } else {
      return true;
    }
  }

  res.render("home", {
    titulo: "HOME - TODOS LOS PRODUCTOS",
    products: products,
    user: profile,
    isAdmin: isAdmin(),
  });
});
productRouter.post("/", async (req, res) => {
  async function productList(type, title, productId, quantity) {
    // Reducir el stock del producto
    const updatedStock = buscarProducto.stock - quantity;
    await productModel.findOneAndUpdate(
      { _id: productId },
      { stock: updatedStock }
    );
    const getProducts = await productModel.find();
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
    const administrador = isAdmin();

    res.render("home", {
      titulo: "HOME - TODOS LOS PRODUCTOS",
      products: products,
      user: profile,
      isAdmin: administrador,
      alertMessage: true,
      type: type,
      title: title,
    });
  }

  function isAdmin() {
    const admin = req.user.role;
    if (admin === "user") {
      return false;
    } else {
      return true;
    }
  }

  const profile = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
  };
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
      console.log("Cantidad del producto modificada exitosamente");
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
      console.log("Producto añadido al carrito exitosamente");
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
});

productRouter.get("/realtimeproducts", async (req, res) => {
  const getProducts = await productModel.find();
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
  });
});
productRouter.post("/realtimeproducts", async (req, res) => {
  async function productList(type, title) {
    const getProducts = await productModel.find();
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
      };
      const product = new productModel(newProduct);
      await product.save();
      productList("success", "PRODUCTO CREADO EXITOSAMENTE");
    }
  } catch (error) {
    productList("error", "OCURRIO UN ERROR! INTENTE NUEVAMENTE");
    return error;
  }
});

export default productRouter;

// productRouter.get("/", auth, async (req, res) => {
//   const { limit = 10, page = 1, sort = "" } = req.query;

//   const query = {};

//   if (req.query.category) {
//     query.category = req.query.category;
//   }

//   if (req.query.status) {
//     query.status = req.query.status;
//   }
//   const ParsedPage = Number(page);
//   const skip = (ParsedPage - 1) * limit;

//   try {
//     const products = await productModel
//       .find(query)
//       .sort(sort === "asc" ? "price" : sort === "desc" ? "-price" : "")
//       .skip(skip)
//       .limit(limit);

//     const count = await productModel.countDocuments(query);

//     const totalPages = parseInt(count / limit);

//     const hasNextPage = Number(ParsedPage < totalPages);
//     const hasPrevPage = ParsedPage > 1;

//     const prevPage = hasPrevPage ? ParsedPage - 1 : null;
//     const nextPage = hasNextPage ? ParsedPage + 1 : null;

//     const prevLink = hasPrevPage
//       ? `${req.protocol}://${req.get("host")}${
//           req.path
//         }?page=${prevPage}&limit=${limit}`
//       : null;

//     const nextLink = hasNextPage
//       ? `${req.protocol}://${req.get("host")}${
//           req.path
//         }?page=${nextPage}&limit=${limit}`
//       : null;

//     const report = {
//       status: "success",
//       payload: products,
//       totalPages,
//       prevPage,
//       nextPage,
//       page: ParsedPage,
//       hasPrevPage,
//       hasNextPage,
//       prevLink,
//       nextLink,
//     };

//     res.status(200).json(report);
//   } catch (error) {
//     const report = {
//       status: "error",
//       payload: error.message,
//     };

//     res.status(500).json(report);
//   }
// });
