import { Router } from "express";
import passport from "passport";
import User from "../dao/models/users.models.js";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const { first_name, last_name, email, role, password } = req.user;
    if (!email) {
      return res
        .status(400)
        .json({ message: "El usuario o contraseña no es valido" });
    }

    if (!password) {
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
    console.log("session iniciada");
    res
      .cookie("authToken", token, { maxAge: 600000, httpOnly: true })
      .status(200)
      .json(req.user);
  }
);

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

router.get("/faillogin", (req, res) => {
  res.json({ error: "No se pudo iniciar session" });
});

router.get("/logout", (req, res) => {
  res.redirect("/");
});

router.patch("/forgotpassword", async (req, res) => {
  try {
    const { email, password } = req.body;

    const passwordEncrypted = createHash(password);

    await User.updateOne({ email }, { password: passwordEncrypted });

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
    console.log("entra?");
    const { first_name, last_name, email, role } = req.user;

    const token = generateToken({
      nombre: first_name,
      apellido: last_name,
      email,
      role: role,
    });
    console.log("session iniciada");
    res
      .cookie("authToken", token, { maxAge: 600000, httpOnly: true })
      .status(200)
      .redirect("/");
  }
);

export default router;
