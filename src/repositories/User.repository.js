import UserDTO from "../DTOs/User.dto.js";
import { isValidPassword } from "../utils/cryptPassword.utils.js";
import { createHash } from "../utils/cryptPassword.utils.js";
import UsersInfoDTO from "../DTOs/UserInfo.dto.js";

class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async find() {
    try {
      const users = await this.dao.find();
      const usersInfo = users.map((user) => new UsersInfoDTO(user));

      return usersInfo;
    } catch (error) {
      return error;
    }
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
      return error;
    }
  }

  async create(newUserInfo) {
    try {
      const { username, body, done } = newUserInfo;
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
        const newUser = await this.dao.create(userInfo);
        return newUser;
      }

      userInfo.role = "user";

      const newUser = await this.dao.create(userInfo);
      return newUser;
    } catch (error) {
      return { error: error.message };
    }
  }

  async updateOne(uid, newUserInfo) {
    try {
      const userUpdated = await this.dao.updateOne(uid, newUserInfo);
      return { message: "Usuario modificado con exito", user: userUpdated };
    } catch (error) {
      return { error };
    }
  }

  async updateDocumentation(uid, newUserInfo) {
    const userInfo = await this.findOne({ _id: uid });
    if (userInfo.error) return userInfo;

    const { user } = userInfo;
    if (!user.documents || user.documents.length === 0) {
      user.documents = [];
      const documents = newUserInfo.map((doc) =>
        user.documents.push({ name: doc.fieldname, reference: doc.path })
      );

      const updateUser = await this.updateOne({ _id: uid }, user);

      return { message: "usuario actualizado" };
    }

    const newDocuments = newUserInfo.map((info) => ({
      name: info.fieldname,
      reference: info.path,
    }));
    const docActualizados = [
      ...user.documents.filter(
        (docExistente) =>
          !newDocuments.some((docNuevo) => docNuevo.name === docExistente.name)
      ),
      ...newDocuments,
    ];

    user.documents = docActualizados;

    const updateUser = await this.updateOne({ _id: uid }, user);

    return { message: "usuario actualizado" };
  }

  async updateLastConnection(uid) {
    try {
      const userOnline = await this.findOne({ _id: uid });
      if (userOnline.error) return userOnline;

      const { user } = userOnline;
      user.last_connection = new Date().toLocaleString();
      const updateUser = await this.updateOne({ _id: uid }, user);

      return { message: "se modifico last_connection con exito" };
    } catch (error) {
      return { error };
    }
  }

  async updateRole(uid) {
    try {
      const user = await this.findOne({ _id: uid });
      const { email, role, documents } = user.user;
      if (user.error) return user;

      const identificacion = "identificacion";
      const comprobanteDeDomicilio = "comprobanteDeDomicilio";
      const comprobanteDeEstadoDeCuenta = "comprobanteDeEstadoDeCuenta";

      const validation = documents.filter((doc) => {
        return (
          doc.name === identificacion ||
          doc.name === comprobanteDeDomicilio ||
          doc.name === comprobanteDeEstadoDeCuenta
        );
      });

      if (validation.length < 3)
        return { error: "Faltan documentos para completar la operacion" };

      role === "premium"
        ? (user.user.role = "user")
        : (user.user.role = "premium");
      const updateUser = await this.updateOne({ _id: uid }, user.user);
      return { message: "se modifico el role con exito" };
    } catch (error) {
      return { error };
    }
  }

  async updatePassword(email, password) {
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
      const updateUser = await this.updateOne({ email: email }, user.user);
      return updateUser;
    } catch (error) {
      return error;
    }
  }

  async deleteOne(uid) {
    try {
      const user = await this.findOne({ _id: uid });
      if (user.error) return user;

      const deleteUser = await this.dao.deleteOne({ _id: uid });
      return deleteUser;
    } catch (error) {
      return { error };
    }
  }
}

export default UserRepository;
