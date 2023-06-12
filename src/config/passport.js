import local from "passport-local";
import passport from "passport";
import { createHash, validatepassword } from "../utils/bcrypt.js";
import Usermodel from "../models/Users.js";
const LocalStrategy = local.Strategy;
const initalizaPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, gender } = req.body;
        try {
          const user = await Usermodel.findOne({ email: email });
          if (user) {
          }
          const passwordHash = createHash(password);
          const userCreated = user.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            age: age,
            gender: gender,
            password: passwordHash,
          });
          console.log(userCreated);
          return done(null, false);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use("login", new LocalStrategy());
};
