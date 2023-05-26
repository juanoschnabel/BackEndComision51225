import { Router } from "express";
import { productModel } from "../models/Products.js";
const productRouter = Router();
productRouter.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || "";
  const query = req.query.query || {};
  const skip = (page - 1) * limit;
  try {
    const products = await productModel
      .find(query)
      .sort(sort === "asc" ? "price" : sort === "desc" ? "-price" : "")
      .skip(skip)
      .limit(limit);
    res.status(200).json(products);
    const report = await productModel.paginate(
      { status: true, category: "F" },
      { limit: 10, page: 2 }
    );
    console.log(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default productRouter;
