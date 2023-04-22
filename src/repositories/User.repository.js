import UserDTO from "../DTOs/User.dto.js";

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
      const { first_name, last_name, age } = body;

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
        userInfo.role = userInfo.googleId ? "google-user" : "user";
      }
      const newUser = await this.dao.create(userInfo);
      return newUser;
    } catch (error) {
      return { error };
    }
  }

  async updateOne(email, password) {
    try {
      const user = await this.findOne(email);
      if (user.error) return user;
      const passwordEncrypted = createHash(password);
      const updateUser = await this.dao.updateOne(email, passwordEncrypted);

      return updateUser;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default UserRepository;
