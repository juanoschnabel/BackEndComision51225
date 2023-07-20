import passport from "passport";
import { userModel } from "../models/Users.js";
import { cartModel } from "../models/Cart.js";
import { Strategy as LocalStrategy } from "passport-local";
import { compareData, hashData } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2";
import config from "../utils/config.js";
import { transporter } from "../utils/nodemailer.js";

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
        // Crear un nuevo carrito y establecer la referencia en el usuario
        const cart = new cartModel();
        await cart.save();
        user.cart = cart._id;
        await user.save();
        await transporter.sendMail({
          to: userNew.email,
          subject: "Ecommerce",
          text: `Hola ${userNew.first_name} ${userNew.last_name}.Tu usuario fue registrado con éxito!!
          El mail registrado es ${userNew.email} y la contraseña es ${register.password}. No compartas esta información con nadie!`,
        });
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
      clientID: config.GITHUB_CLIENTID,
      clientSecret: config.CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL_GITHUB,
    },

    async (accesToken, refreshToken, profile, done) => {
      const { name, email, id, login } = profile._json;
      async function createUser(usuario) {
        const newUserDB = await userModel.create(usuario);
        // Crear un nuevo carrito y establecer la referencia en el usuario
        const cart = new cartModel();
        await cart.save();
        newUserDB.cart = cart._id;
        await newUserDB.save();

        done(null, newUserDB);
      }
      try {
        if (email === null) {
          const userBD = await userModel.findOne({ email: id.toString() });
          if (userBD) {
            return done(null, userBD);
          } else {
            const hashPassword = await hashData(
              process.env.HASH_PASSWORD_GITHUB
            );
            const user = {
              first_name: "@" + login,
              last_name: " ",
              email: id.toString(),
              password: hashPassword,
            };
            createUser(user);
          }
        } else {
          const userBD = await userModel.findOne({ email });
          if (userBD) {
            return done(null, userBD);
          }
          const hashPassword = await hashData(process.env.HASH_PASSWORD_GITHUB);
          const user = {
            first_name: name.split(" ")[0] || login,
            last_name: name.split(" ")[1] || " ",
            email: email,
            password: hashPassword,
          };
          createUser(user);
        }
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
