import { Router } from "express";
import passport from "passport";
import User from "../dao/models/users.models.js";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";
import { generateToken } from "../utils/jwt.js";
import { passportCall } from "../config/passportCall.js";
import { userService } from "../repositories/index.js";

const router = Router();

router.post("/login", passportCall("login"), (req, res) => {
  const { first_name, last_name, email, role, password } = req.user;
  if (!email) {
    req.logger.error("El usuario o contraseña no es valido");
    return res
      .status(400)
      .json({ message: "El usuario o contraseña no es valido" });
  }

  if (!password) {
    req.logger.error("El usuario o contraseña no es valido");
    return res
      .status(400)
      .json({ message: "El usuario o contraseña no es valido" });
  }
  const token = generateToken({
    nombre: first_name,
    apellido: last_name,
    email,
    role: role,
  });
  req.logger.info("session iniciada");
  res
    .cookie("authToken", token, { maxAge: 60000 * 6, httpOnly: true })
    .status(200)
    .json({ role, token });
});

router.get("/current", passportCall("current"), (req, res) => {
  res.json(req.user);
});

router.get("/faillogin", (req, res) => {
  res.json({ error: "No se pudo iniciar session" });
});

router.get("/logout", (req, res) => {
  res.redirect("/");
});

router.patch("/forgotpassword", async (req, res) => {
  try {
    const user = req.body;

    await userService.updateOne(user);

    res.json({ message: "Contraseña actualizada" });
  } catch (error) {
    console.log(error);
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] }),
  async (req, res) => {}
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const { first_name, last_name, email, role } = req.user;

    const token = generateToken({
      nombre: first_name,
      apellido: last_name,
      email,
      role: role,
    });
    req.logger.info("session iniciada");
    res
      .cookie("authToken", token, { maxAge: 600000, httpOnly: true })
      .status(200)
      .redirect("/");
  }
);

export default router;
