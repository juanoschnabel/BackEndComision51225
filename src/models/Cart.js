import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
const cartSchema = new Schema({
  products: {
    type: [
      {
        _id: false,
        id_prod: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
    default: [],
  },
});
cartSchema.plugin(paginate);
export const cartModel = model("carts", cartSchema);
