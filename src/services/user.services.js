import { userModel } from "../models/Users.js";
import { DateTime } from "luxon";
import { transporter } from "../utils/nodemailer.js";

class UserService {
  async getUsers(req, res) {
    try {
      const getUsers = await userModel.find();
      const users = getUsers.map(
        ({
          first_name,
          last_name,
          email,
          age,
          role,
          cart,
          _id,
          user_creation_date,
          last_login,
        }) => ({
          first_name,
          last_name,
          email,
          age,
          role,
          cart,
          _id,
          user_creation_date,
          last_login,
        })
      );
      res.render("sessions/users", {
        users: users,
      });
    } catch (error) {
      return error;
    }
  }
  async traerUsuariosSinBorrar(req, res) {
    try {
      const getUsers = await userModel.find();
      const users = getUsers.map(
        ({
          first_name,
          last_name,
          email,
          age,
          role,
          cart,
          _id,
          user_creation_date,
          last_login,
        }) => ({
          first_name,
          last_name,
          email,
          age,
          role,
          cart,
          _id,
          user_creation_date,
          last_login,
        })
      );
      res.render("sessions/usuarios", {
        users: users,
      });
    } catch (error) {
      return error;
    }
  }
  async deleteUser(req, res) {
    const idUser = req.body.borrar;
    const modificarUser = req.body.modificarUser;
    const modificarPremium = req.body.modificarPremium;
    const modificarAdmin = req.body.modificarAdmin;
    if (modificarUser) {
      await userModel.findOneAndUpdate(
        { email: modificarUser },
        { $set: { role: "user" } },
        { new: true }
      );
    }
    if (modificarPremium) {
      await userModel.findOneAndUpdate(
        { cart: modificarPremium },
        { $set: { role: "premium" } },
        { new: true }
      );
    }
    if (modificarAdmin) {
      await userModel.findOneAndUpdate(
        { _id: modificarAdmin },
        { $set: { role: "admin" } },
        { new: true }
      );
    }
    if (idUser) {
      const user = await userModel.find({ _id: idUser });
      await transporter.sendMail({
        to: user[0].email,
        subject: "Eliminacion de usuario",
        html: `
          <html>
            <head>
              <style>
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
                ul {
                  list-style: none;
                  padding: 0;
                }
                li {
                  margin-bottom: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Tu usuario fue eliminado de la plataforma</h1>
                <p>Tu usuario fue eliminado de la plataforma por un administrador. Puedes volver a registrarte cuando quieras!</p>
                <p>Te esperamos de nuevo!</p>
              </div>
            </body>
          </html>
        `,
      });
      await userModel.deleteOne({ _id: idUser });
    }
    const getUsers = await userModel.find();
    const users = getUsers.map(
      ({
        first_name,
        last_name,
        email,
        age,
        role,
        cart,
        _id,
        user_creation_date,
        last_login,
      }) => ({
        first_name,
        last_name,
        email,
        age,
        role,
        cart,
        _id,
        user_creation_date,
        last_login,
      })
    );
    res.render("sessions/users", {
      users: users,
    });
  }
  async deleteOldUsers(req, res) {
    const now = DateTime.now();
    const twoHoursAgo = now.minus({ hours: 2 });
    // const twoMinutesAgo = now.minus({ minutes: 2 });
    const usersToDelete = await userModel.find({
      last_login: { $lt: twoHoursAgo },
    });
    for (const user of usersToDelete) {
      await userModel.findByIdAndRemove(user._id);
      await transporter.sendMail({
        to: user.email,
        subject: "Eliminacion de usuario",
        html: `
          <html>
            <head>
              <style>
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
                ul {
                  list-style: none;
                  padding: 0;
                }
                li {
                  margin-bottom: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Tu usuario fue eliminado de la plataforma</h1>
                <p>Tu usuario fue eliminado de la plataforma por su inactividad. Puedes volver a registrarte cuando quieras!</p>
                <p>Te esperamos de nuevo!</p>
              </div>
            </body>
          </html>
        `,
      });
    }
    const getUsers = await userModel.find();
    const users = getUsers.map(
      ({
        first_name,
        last_name,
        email,
        age,
        role,
        cart,
        _id,
        user_creation_date,
        last_login,
      }) => ({
        first_name,
        last_name,
        email,
        age,
        role,
        cart,
        _id,
        user_creation_date,
        last_login,
      })
    );
    res.render("sessions/usuarios", {
      users: users,
    });
  }
}

export const userService = new UserService();
