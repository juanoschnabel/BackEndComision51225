import { Router } from "express";
import { generateProducts } from "../utils/generateProductsWithFaker.js";
const createProductsWhitFacker = Router();
createProductsWhitFacker.get("/", async (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  console.log(products);
  res.json({ products });
});
export default createProductsWhitFacker;
