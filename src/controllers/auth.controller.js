import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import { passportCall } from "../config/passportCall.js";
import { userService } from "../repositories/index.js";

const router = Router();

router.post("/login", passportCall("login"), (req, res) => {
  const { first_name, last_name, email, role, _id, error } = req.user;
  if (error) {
    req.logger.error(error);
    return res.status(400).json({ error });
  }
  if (!req.body.email) {
    req.logger.error("fields are missing to complete");
    return res.status(400).json({ error: "the email field is missing" });
  }

  if (!req.body.password) {
    req.logger.error("fields are missing to complete");
    return res.status(400).json({ error: "The password field is missing" });
  }
  const token = generateToken({
    _id,
    nombre: first_name,
    apellido: last_name,
    email,
    role: role,
  });
  req.logger.info("session started");
  res
    .cookie("authToken", token, { maxAge: 60000 * 6, httpOnly: true })
    .status(200)
    .json({ role, token });
});

router.get("/current", passportCall("current"), (req, res) => {
  res.json(req.user);
});

router.get("/faillogin", (req, res) => {
  req.logger.error("An error occurred logging in");
  res.status(500).json({ error: "An error occurred logging in" });
});

router.get("/logout", (req, res) => {
  res.redirect("/");
});

router.patch("/forgotpassword", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newPassword = await userService.updatePassword(email, password);
    if (newPassword.error) return res.json({ newPassword });
    req.logger.inf("updated password");
    res.json({ message: "updated password" });
  } catch (error) {
    req.logger.error(error.message);
    res
      .status(500)
      .json({ error: "An internal problem occurred on the server" });
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
    try {
      const { first_name, last_name, email, role, _id } =
        req.user?.user || req.user;

      const token = generateToken({
        _id: _id,
        nombre: first_name,
        apellido: last_name,
        email,
        role: role,
      });
      req.logger.info("session started");
      res.cookie("authToken", token, { maxAge: 600000, httpOnly: true });
      res.redirect("https://ecommerce-matias.vercel.app/products");
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.get("/", passportCall("current"), async (req, res) => {
  try {
    const { _id } = req.user.payload;
    const updateConnection = await userService.updateLastConnection(_id);
    req.logger.info(`The user with ${_id} has logged out`);
    res.clearCookie("authToken", { httpOnly: true });
    redirect("https://ecommerce-matias.vercel.app");
  } catch (error) {
    req.logger.error(error.message);
    res
      .status(500)
      .json({ error: "An internal problem occurred on the server" });
  }
});

router.get("/cart", passportCall("jwt"), (req, res) => {
  res.json(req.user);
});

export default router;
