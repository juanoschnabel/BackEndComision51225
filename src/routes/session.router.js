import { Router } from "express";
import { userModel } from "../models/Users.js";
import { hashData, compareData } from "../utils/bcrypt.js";
import passport from "passport";
const sessionRouter = Router();
//vista para registrar usuarios
sessionRouter.get("/register", (req, res) => {
  res.render("sessions/register");
});
// sessionRouter.post("/register", async (req, res) => {
//   try {
//     const register = req.body;
//     const hashPassword = await hashData(register.password);
//     const userNew = { ...req.body, password: hashPassword };
//     const user = new userModel(userNew);
//     await user.save();
//     res.redirect("/sessions/login");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Email registrado. Ingrese uno nuevo");
//   }
// });

//Vista de login
sessionRouter.get("/login", (req, res) => {
  res.render("sessions/login");
});
//Login sin passport
// sessionRouter.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await userModel.findOne({ email }).lean().exec();
//   if (!user) {
//     return res.status(401).render("errors/base", {
//       error: "Error en mail y/o contraseña",
//     });
//   }
//   const isPasswordValid = await compareData(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(400).json({ message: "Email o contraseña incorrectas" });
//   }
//   req.session.user = user;
//   res.redirect("/api/products");
// });
//login con passport

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/products/errorLogin",
    successRedirect: "/api/products",
  })
);
//register con pasport
sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/products/errorLogin",
    successRedirect: "/sessions/login",
  })
);
sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      res.status(500).render("errors/base", {
        error: err,
      });
    else res.redirect("/sessions/login");
  });
});

sessionRouter.get(
  "/githubSignup",
  passport.authenticate("githubSignup", { scope: ["user:email"] })
);
sessionRouter.get(
  "/github",
  passport.authenticate("githubSignup", {
    failureRedirect: "/api/products/errorLogin",
  }),
  function (req, res) {
    res.redirect("/api/products");
  }
);
export default sessionRouter;
