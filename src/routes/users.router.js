import { Router } from "express";
import { userService } from "../services/user.services.js";
const usersRouter = Router();
usersRouter.get("/", (req, res) => {
  userService.traerUsuariosSinBorrar(req, res);
});
usersRouter.delete("/delete", (req, res) => {
  userService.deleteOldUsers(req, res);
});

export default usersRouter;
