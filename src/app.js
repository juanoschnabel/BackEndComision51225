import express from "express";
import productRouter from "./routes/product.routes.js";
import { __direname } from "./path.js";
import multer from "multer";
import cartRouter from "./routes/cart.routes.js";

const app = express();
const PORT = 8080;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const upload = multer({ storage: storage });
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/static", express.static(__direname + "/public"));
app.post("/upload", upload.single("product"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.send("imagen subida");
});
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
