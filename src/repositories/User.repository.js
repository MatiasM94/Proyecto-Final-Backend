import UserDTO from "../DTOs/User.dto.js";

class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async findOne(email) {
    try {
      const user = await this.dao.findOne(email);
      if (user) return { user };
      return { error: `The user with email ${email} does not exist` };
    } catch (error) {
      return { error };
    }
  }
  async create(newUserInfo) {
    try {
      const { username, password, body, done } = newUserInfo;
      const { first_name, last_name, age } = body;

      if (!first_name || !last_name || !age || !password || !username) {
        return done(null, "faltan campos por completar");
      }

      const verifyExistUser = await this.dao.findOne({ email: username });
      if (verifyExistUser) {
        return done({ error: "No se pudo registrar su usuario" });
      }
      const userInfo = new UserDTO({ body, email: username, password });
      if (username === "adminCoder@coder.com") {
        userInfo.role = "admin";
      } else {
        userInfo.role = "user";
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
