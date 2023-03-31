import jwt from "jsonwebtoken";
import Route from "./router.js";
import UserManager from "../dao/managerMongo/user.managerMongo.js";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";
import passport from "passport";
import { passportCall } from "../config/passport.jwt.config.js";

const User = new UserManager();

class UserRouter extends Route {
  init() {
    this.get("/current", ["PUBLIC"], passportCall("current"), (req, res) => {
      res.sendSucces(req.user);
    });

    this.post("/login", ["PUBLIC"], async (req, res) => {
      const { email, password } = req.body;
      try {
        const user = await User.findOne(email);

        if (!user) {
          console.log("El usuario no existe");
          return res.sendUserError("El usuario o contraseña no es valido");
        }

        if (!isValidPassword(user, password)) {
          console.log("contraseña no valida");
          return res.sendUserError("El usuario o contraseña no es valido");
        }

        const token = jwt.sign({ email, role: user.role }, "kjsadfniw4213");
        console.log("session iniciada");
        res
          .cookie("authToken", token, { maxAge: 60000, httpOnly: true })
          .sendSucces({ token });
      } catch (error) {
        res.sendServerError(`Algo a fallado, ${error}`);
      }
    });

    this.post("/register", async (req, res) => {
      const { first_name, last_name, email, age, password } = req.body;
      try {
        const user = await User.findOne(email);

        if (user) {
          return res.json({ message: "El usuario ya existe", exist: true });
        }

        const newUserInfo = {
          first_name,
          last_name,
          email,
          age,
          password: createHash(password),
        };

        if (email === "adminCoder@coder.com") {
          newUserInfo.role = "admin";
        } else {
          newUserInfo.role = "user";
        }

        const newUser = await User.create(newUserInfo);
        res.sendSucces("Usuario Creado");
      } catch (error) {
        console.log(error);
        res.sendServerError(`Algo a fallado, ${error}`);
      }
    });
  }
}

export default UserRouter;
