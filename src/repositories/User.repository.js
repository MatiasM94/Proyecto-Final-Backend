import UserDTO from "../DTOs/User.dto.js";
import { isValidPassword } from "../utils/cryptPassword.utils.js";
import { createHash } from "../utils/cryptPassword.utils.js";

class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async findOne(email) {
    try {
      const user = await this.dao.findOne(email);
      if (user) return { user };
      return {
        error: `The user with email ${email} does not exist`,
        user: false,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  async create(newUserInfo) {
    try {
      const { username, password, body, done } = newUserInfo;
      const { first_name, last_name, age, premium } = body;

      if (!first_name || !last_name || !age || !username) {
        return done(null, "faltan campos por completar");
      }
      const verifyExistUser = await this.dao.findOne({ email: username });
      if (verifyExistUser) {
        return { error: "No se pudo registrar su usuario" };
      }

      const userInfo = new UserDTO(newUserInfo);
      if (username === "adminCoder@coder.com") {
        userInfo.role = "admin";
      } else {
        userInfo.role = premium ? "premium" : "user";
        userInfo.premium = premium;
      }
      const newUser = await this.dao.create(userInfo);
      return newUser;
    } catch (error) {
      return { error };
    }
  }

  async update(uid) {
    try {
      const user = await this.findOne({ _id: uid });
      const { email, role } = user.user;
      if (user.error) return user;

      role === "premium"
        ? (user.user.role = "user")
        : (user.user.role = "premium");
      const updateUser = await this.dao.updateOne({ _id: uid }, user.user);
      return { message: "se modifico el role con exito" };
    } catch (error) {
      return { error };
    }
  }

  async updateOne(email, password) {
    try {
      const user = await this.findOne({ email: email });

      if (user.error) return user;

      const verifyPassword = isValidPassword(user.user, password);
      if (verifyPassword) {
        return {
          error:
            "Su nueva contraseña no debe coincidir con su actual contraseña",
        };
      }

      const passwordEncrypted = createHash(password);
      user.user.password = passwordEncrypted;
      const updateUser = await this.dao.updateOne({ email: email }, user.user);
      return updateUser;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default UserRepository;
