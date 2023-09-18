import { Router } from "express";
import { productService } from "../services/products.services.js";
const productRouter = Router();
productRouter.get("/errorLogin", (req, res) => {
  res.render("errorLogin");
});
productRouter.get("/", async (req, res) => {
  productService.getProducts(req, res);
});

productRouter.post("/", async (req, res) => {
  productService.addProduct(req, res);
});

productRouter.get("/realtimeproducts", async (req, res) => {
  productService.getRealTimeProducts(req, res);
});
productRouter.post("/realtimeproducts", async (req, res) => {
  productService.postRealTimeProducts(req, res);
});

export default productRouter;
