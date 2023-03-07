import { Router } from "express";
import User from "../dao/models/users.models.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ error: "El usuario y la contraseña no coincide" });

    if (user.password !== password) {
      return res
        .status(400)
        .json({ error: "El usuario y la contraseña no coincide" });
    }

    if (email === "adminCoder@coder.com") {
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: "admin",
      };
    } else {
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: "user",
      };
    }
    const { role } = req.session.user;
    res.json({ message: "sesion iniciada", role: role });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.json({ error });
    res.redirect("/");
  });
});

export default router;
