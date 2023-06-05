import { Router } from "express";
import passport from "passport";
import User from "../dao/models/users.models.js";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";
import { generateToken } from "../utils/jwt.js";
import { passportCall } from "../config/passportCall.js";
import { userService } from "../repositories/index.js";

const router = Router();

router.post("/login", passportCall("login"), (req, res) => {
  const { first_name, last_name, email, role, password, _id, error } = req.user;
  if (error) {
    req.logger.error(error);
    return res.status(400).json({ error });
  }
  if (!req.body.email) {
    req.logger.error("faltan campos por completar");
    return res.status(400).json({ error: "falta completar el campo email" });
  }

  if (!req.body.password) {
    req.logger.error("faltan campos por completar");
    return res.status(400).json({ error: "falta completar el campo password" });
  }
  const token = generateToken({
    _id,
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
    const { email, password } = req.body;
    const newPassword = await userService.updateOne(email, password);
    if (newPassword.error) return res.json({ newPassword });

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
    const { first_name, last_name, email, role } = req.user?.user || req.user;
    console.log(req.user);
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
      .redirect("http://localhost:8000/products");
  }
);

router.get("/", (req, res) => {
  res
    .clearCookie("authToken")
    .clearCookie("connect.sid")
    .redirect("http://localhost:8000");
});

export default router;
