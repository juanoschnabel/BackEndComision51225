import passport from "passport";
import { userModel } from "../models/Users.js";
import { cartModel } from "../models/Cart.js";
import { Strategy as LocalStrategy } from "passport-local";
import { compareData, hashData } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../utils/config.js";
import { transporter } from "../utils/nodemailer.js";
import CustomError from "../services/errors/CustomError.js";
import { EErrors } from "../services/errors/enum.js";
import { DateTime } from "luxon";
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
        const newLogin = DateTime.now();
        await userModel.findByIdAndUpdate(user._id, {
          last_login: newLogin,
        });
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
//REGISTRO
passport.use(
  "register",
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      const { first_name, last_name, age, role } = req.body;
      try {
        if (!first_name || !last_name || !email) {
          CustomError.createError({
            name: "error al crear el usuario",
            cause: generateUserErrorInfo({
              first_name,
              last_name,
              age,
              email,
              role,
            }),
            message: "Error al crear el usuario",
            code: EErrors.INVALID_TYPES_ERROR,
          });
        }
        const register = req.body;
        const hashPassword = await hashData(register.password);
        const userNew = { ...req.body, password: hashPassword };
        const user = new userModel(userNew);
        await user.save();
        const cart = new cartModel();
        await cart.save();
        user.cart = cart._id;
        await user.save();
        await transporter.sendMail({
          to: userNew.email,
          subject: "Registro Exitoso en Ecommerce",
          html: `
            <html>
              <head>
                <style>
                  /* Agrega estilos CSS aquí para dar formato al correo electrónico */
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    padding: 20px;
                  }
                  .container {
                    background-color: #ffffff;
                    border-radius: 5px;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                    color: #333;
                  }
                  p {
                    color: #555;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>¡Registro Exitoso en Ecommerce!</h1>
                  <p>Hola ${userNew.first_name} ${userNew.last_name},</p>
                  <p>Tu usuario ha sido registrado con éxito en nuestro sistema.</p>
                  <p>A continuación, encontrarás los detalles de tu registro:</p>
                  <ul>
                    <li><strong>Email:</strong> ${userNew.email}</li>
                    <li><strong>Contraseña:</strong> ${register.password}</li>
                  </ul>
                  <p>No compartas esta información con nadie y mantenla segura.</p>
                  <p>Gracias por unirte a Ecommerce.</p>
                </div>
              </body>
            </html>
          `,
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
//GITHUB
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
            const newLogin = DateTime.now();
            await userModel.findByIdAndUpdate(userBD._id, {
              last_login: newLogin,
            });
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
            const newLogin = DateTime.now();
            await userModel.findByIdAndUpdate(userBD._id, {
              last_login: newLogin,
            });
            return done(null, userBD);
          }
          const hashPassword = await hashData(process.env.HASH_PASSWORD_GITHUB);
          const user = {
            first_name: name.split(" ")[0] || login,
            last_name: name.split(" ")[1] || " ",
            email: email,
            password: hashPassword,
          };
          await transporter.sendMail({
            to: user.email,
            subject: "Registro Exitoso en Ecommerce",
            html: `
              <html>
                <head>
                  <style>
                    /* Agrega estilos CSS aquí para dar formato al correo electrónico */
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #f5f5f5;
                      padding: 20px;
                    }
                    .container {
                      background-color: #ffffff;
                      border-radius: 5px;
                      padding: 20px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                      color: #333;
                    }
                    p {
                      color: #555;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>¡Registro Exitoso en Ecommerce!</h1>
                    <p>Hola ${user.first_name} ${user.last_name},</p>
                    <p>Tu usuario ha sido registrado con éxito en nuestro sistema.</p>
                    <p>A continuación, encontrarás los detalles de tu registro:</p>
                    <ul>
                      <li><strong>Email:</strong> ${user.email}</li>
                      <li><strong>Contraseña por defecto:</strong> 1234</li>
                    </ul>
                    <p>No compartas esta información con nadie y mantenla segura.</p>
                    <p>Gracias por unirte a Ecommerce.</p>
                  </div>
                </body>
              </html>
            `,
          });
          createUser(user);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

//GOOGLE

passport.use(
  "googleStrategy",
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL_GOOGLE,
    },
    async (accesToken, refreshToken, profile, done) => {
      const { given_name, family_name, email } = profile._json;
      try {
        const userBD = await userModel.findOne({ email });
        if (userBD) {
          const newLogin = DateTime.now();
          await userModel.findByIdAndUpdate(userBD._id, {
            last_login: newLogin,
          });
          return done(null, userBD);
        }
        const hashPassword = await hashData(process.env.HASH_PASSWORD_GITHUB);
        const user = {
          first_name: given_name,
          last_name: family_name || "",
          email: email,
          password: hashPassword,
        };
        const newUserDB = await userModel.create(user);
        const cart = new cartModel();
        await cart.save();
        newUserDB.cart = cart._id;
        await newUserDB.save();
        await transporter.sendMail({
          to: user.email,
          subject: "Registro Exitoso en Ecommerce",
          html: `
            <html>
              <head>
                <style>
                  /* Agrega estilos CSS aquí para dar formato al correo electrónico */
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    padding: 20px;
                  }
                  .container {
                    background-color: #ffffff;
                    border-radius: 5px;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                    color: #333;
                  }
                  p {
                    color: #555;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>¡Registro Exitoso en Ecommerce!</h1>
                  <p>Hola ${user.first_name} ${user.last_name},</p>
                  <p>Tu usuario ha sido registrado con éxito en nuestro sistema.</p>
                  <p>A continuación, encontrarás los detalles de tu registro:</p>
                  <ul>
                    <li><strong>Email:</strong> ${user.email}</li>
                    <li><strong>Contraseña por defecto:</strong> 1234</li>
                  </ul>
                  <p>No compartas esta información con nadie y mantenla segura.</p>
                  <p>Gracias por unirte a Ecommerce.</p>
                </div>
              </body>
            </html>
          `,
        });
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
