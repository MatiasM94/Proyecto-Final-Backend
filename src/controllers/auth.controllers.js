import { Router } from "express";
import passport from "passport";
import User from "../dao/models/users.models.js";
import { createHash, isValidPassword } from "../utils/cryptPassword.utils.js";

const router = Router();

router.post(
  "/",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    try {
      if (!req.user)
        return res.status(400).json({ error: "Credenciales invalidas" });

      const { first_name, last_name, age, email, role } = req.user;

      req.session.user = {
        first_name,
        last_name,
        age,
        email,
        role,
      };

      res.json({ message: req.user });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }
);

router.get("/faillogin", (req, res) => {
  res.json({ error: "No se pudo iniciar session" });
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.json({ error });
    res.redirect("/");
  });
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
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;

    res.redirect("/");
  }
);

export default router;
