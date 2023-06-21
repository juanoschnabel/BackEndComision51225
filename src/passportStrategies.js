import passport from "passport";
import { userModel } from "./models/Users.js";
import { Strategy as LocalStrategy } from "passport-local";
import { compareData, hashData } from "./utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2";
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
passport.use(
  "register",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const register = req.body;
        const hashPassword = await hashData(register.password);
        const userNew = { ...req.body, password: hashPassword };
        const user = new userModel(userNew);
        await user.save();
        return done(null, user);
      } catch (error) {
        if (error.name === "MongoServerError" && error.code === 11000) {
          return done(null, false);
        }
        done(error);
      }
    }
  )
);
passport.use(
  "githubSignup",
  new GithubStrategy(
    {
      clientID: "Iv1.eee005f58eedb44f",
      clientSecret: "08bebfd2768b8f601ab8e2f3b0c983976a429224",
      callbackURL: "http://localhost:8080/sessions/github",
    },
    async (accesToken, refreshToken, profile, done) => {
      const { name, email } = profile._json;
      try {
        const userBD = await userModel.findOne({ email });
        if (userBD) {
          return done(null, userBD);
        }
        const user = {
          first_name: name.split(" ")[0],
          last_name: name.split(" ")[1] || "",
          email: email,
          password: " ",
        };
        const newUserDB = await userModel.create(user);
        done(null, newUserDB);
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
