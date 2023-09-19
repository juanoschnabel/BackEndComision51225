import { userModel } from "../models/Users.js";
import { DateTime } from "luxon";

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
  async deleteUser(req, res) {
    const idUser = req.body.borrar;
    await userModel.deleteOne({ _id: idUser });
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
    // const twoHoursAgo = now.minus({ hours: 2 });
    const twoMinutesAgo = now.minus({ minutes: 2 });
    await userModel.deleteMany({
      last_login: { $lt: twoMinutesAgo },
    });
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
}

export const userService = new UserService();
