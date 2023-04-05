import jwt from "jsonwebtoken";
import Route from "./router.js";
import passport from "passport";

class UserRouter extends Route {
  init() {
    this.get(
      "/current",
      ["admin"],
      passport.authenticate("current", { session: false }),
      (req, res) => {
        res.sendSucces(req.user);
      }
    );

    this.post(
      "/login",
      ["PUBLIC"],
      passport.authenticate("login", { session: false }),
      async (req, res) => {
        const { email, role, password } = req.user;
        try {
          if (!email) {
            return res.sendUserError("El usuario o contraseña no es valido");
          }

          if (!password) {
            return res.sendUserError("El usuario o contraseña no es valido");
          }
          const token = jwt.sign({ email, role: role }, "kjsadfniw4213");
          console.log("session iniciada");
          res
            .cookie("authToken", token, { maxAge: 60000, httpOnly: true })
            .sendSucces(req.user);
        } catch (error) {
          res.sendServerError(`Algo a fallado, ${error}`);
        }
      }
    );

    this.post(
      "/register",
      ["PUBLIC"],
      passport.authenticate("register", { session: false }),
      async (req, res) => {
        const { email } = req.user;
        try {
          if (!email) {
            return res.sendUserError({
              message: "El usuario ya existe",
              exist: true,
            });
          }

          res.sendSucces("Usuario Creado");
        } catch (error) {
          console.log(error);
          res.sendServerError(`Algo a fallado, ${error}`);
        }
      }
    );
  }
}

export default UserRouter;
