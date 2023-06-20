import passport from "passport";
import { userModel } from "./models/Users.js";
import { Strategy as LocalStrategy } from "passport-local";
import { compareData } from "./utils/bcrypt.js";

//estrategia passport-local (username, password)
passport.use(
  "login",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await userModel.findOne({ email }).lean().exec();
        if (!user) {
          return done(null, false);
        }
        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
