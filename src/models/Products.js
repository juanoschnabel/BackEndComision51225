import { Schema, model } from "mongoose";
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  desciption: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  thumbnail: [],
});

export default productModel = model(productSchema, "products");
