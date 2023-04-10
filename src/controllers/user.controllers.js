import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  async (req, res) => {
    const { user } = req;
    try {
      res.json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `Algo a fallado, ${error}` });
    }
  }
);

// router.post(
//   "/",
//   passport.authenticate("register", { failureRedirect: "/failregister" }),
//   async (req, res) => {
//     try {
//       res.json({ message: "Usuario Registrado" });
//     } catch (error) {
//       if (error.code === 11000)
//         return res.status(400).json({ error: "El usuario ya existe" });
//       res.status(500).json({ error: "Error interno del servidor" });
//     }
//   }
// );

// router.get("/failregister", (req, res) => {
//   console.log("Fallo el registro");
//   res.json({ error: "Fallo el registro" });
// });

export default router;
