import { Router } from "express";
import { productModel } from "../models/Products.js";
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
  res.render("home", {
    titulo: "HOME - TODOS LOS PRODUCTOS",
    products: products,
    user: profile,
    isAdmin: user.isAdmin,
  });
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
  if (req.body.borrar) {
    const productId = req.body.borrar;
    await productModel.deleteOne({ _id: productId });
    res.redirect("/api/products/realtimeproducts");
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
    res.redirect("/api/products/realtimeproducts");
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
