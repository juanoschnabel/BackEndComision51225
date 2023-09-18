import { userModel } from "../models/Users.js";

class UserService {
  async getUsers(req, res) {
    try {
      const login = false;
      const getUsers = await userModel.find();
      const users = getUsers.map(
        ({ first_name, last_name, email, age, role, cart, _id }) => ({
          first_name,
          last_name,
          email,
          age,
          role,
          cart,
          _id,
        })
      );
      res.render("sessions/users", {
        users: users,
        login,
      });
    } catch (error) {
      return error;
    }
  }
  async getUsersAdmin(req, res) {
    try {
      const login = true;
      const getUsers = await userModel.find();
      const users = getUsers.map(
        ({ first_name, last_name, email, age, role, cart, _id }) => ({
          first_name,
          last_name,
          email,
          age,
          role,
          cart,
          _id,
        })
      );
      res.render("sessions/users", {
        users: users,
        login,
      });
    } catch (error) {
      return error;
    }
  }
  async deleteUser(req, res) {
    const idUser = req.body.borrar;
    await userModel.deleteOne({ _id: idUser });
    const getUsers = await userModel.find();
    const users = getUsers.map(
      ({ first_name, last_name, email, age, role, cart, _id }) => ({
        first_name,
        last_name,
        email,
        age,
        role,
        cart,
        _id,
      })
    );
    res.render("sessions/users", {
      users: users,
      login,
    });
  }
}

export const userService = new UserService();
