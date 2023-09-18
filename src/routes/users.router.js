import { Router } from "express";
import { userService } from "../services/user.services.js";
const usersRouter = Router();
sessionRouter.get("/", (req, res) => {
  userService.getUsers(req, res, false);
});
export default usersRouter;
