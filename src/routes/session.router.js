import { Router } from "express";
import { userService } from "../services/user.services.js";
import passport from "passport";
const sessionRouter = Router();
//vista para registrar usuarios
sessionRouter.get("/register", (req, res) => {
  res.render("sessions/register");
});

//Vista de login
sessionRouter.get("/login", (req, res) => {
  res.render("sessions/login");
});

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/products/errorLogin",
    successRedirect: "/sessions/current",
  })
);
sessionRouter.get("/users", (req, res) => {
  userService.getUsers(req, res);
});
sessionRouter.post("/users", (req, res) => {
  userService.deleteUser(req, res);
});
// sessionRouter.delete("/users", (req, res) => {
//   userService.deleteOldUsers(req, res);
// });
sessionRouter.get("/current", (req, res) => {
  const {
    first_name,
    last_name,
    email,
    age,
    role,
    cart,
    last_login,
    user_creation_date,
  } = req.user;
  res.render("sessions/current", {
    name: first_name,
    lastName: last_name,
    email: email,
    age: age,
    rol: role,
    isAdmin: role != "admin",
    cart: cart,
    last_login,
    user_creation_date,
  });
});
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
    res.redirect("/sessions/current");
  }
);
//google
sessionRouter.get(
  "/googleStrategy",
  passport.authenticate("googleStrategy", { scope: ["profile", "email"] })
);

sessionRouter.get(
  "/google",
  passport.authenticate("googleStrategy", {
    failureRedirect: "/api/products/errorLogin",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/sessions/current");
  }
);
export default sessionRouter;
