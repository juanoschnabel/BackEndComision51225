import { Router } from "express";
import { userModel } from "../models/Users.js";
const sessionRouter = Router();
//vista para registrar usuarios
sessionRouter.get("/register", (req, res) => {
  res.render("sessions/register");
});
sessionRouter.post("/register", async (req, res) => {
  try {
    const userNew = req.body;
    const user = new userModel(userNew);
    await user.save();
    res.redirect("/sessions/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Email registrado. Ingrese uno nuevo");
  }
});
//Vista de login
sessionRouter.get("/login", (req, res) => {
  res.render("sessions/login");
});
sessionRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, password }).lean().exec();
  if (!user) {
    return res.status(401).render("errors/base", {
      error: "Error en mail y/o contraseña",
    });
  }
  req.session.user = user;
  res.redirect("/api/products");
});
sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      res.status(500).render("errors/base", {
        error: err,
      });
    else res.redirect("/sessions/login");
  });
});
export default sessionRouter;
