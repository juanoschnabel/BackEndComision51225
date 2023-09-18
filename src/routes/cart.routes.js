//IMPORTACIONES
import { Router } from "express";
import { cartService } from "../services/carts.service.js";
import { createSession } from "../controllers/payment.controller.js";
const cartRouter = Router();
// //RUTAS
cartRouter.get("/:cid/purchase", async (req, res) => {
  cartService.getPurchase(req, res);
});
cartRouter.post("/:cid/purchase", async (req, res) => {
  cartService.deleteProduct(req, res);
});
cartRouter.get("/:cid/:total/payment", async (req, res) => {
  createSession(req, res);
});
cartRouter.get("/:cid/:total/ticket", async (req, res) => {
  cartService.getTicket(req, res);
});

cartRouter.get("/", async (req, res) => {
  cartService.getCart(req, res);
});
cartRouter.post("/", async (req, res) => {
  cartService.postCart(req, res);
});
export default cartRouter;
