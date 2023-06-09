import { Router } from "express";
import passport from "passport";
import { passportCall } from "../config/passportCall.js";
import { autorization } from "../middlewares/autorization.middleware.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.get(
  "/profile",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const { payload } = req.user;
    res.render("profile.handlebars", { payload });
  }
);

router.get("/", (req, res) => {
  if (req.cookies.authToken) return res.redirect("/profile");
  res.render("login.handlebars");
});

router.get("/signup", (req, res) => {
  res.render("signup.handlebars");
});

router.get("/forgotpassword", passportCall("jwt"), (req, res) => {
  res.render("forgotpassword");
});

router.get("/sendemail", (req, res) => {
  res.render("sendemail");
});
router.get("/verificacion", (req, res) => {
  const email = req.email;

  const token = generateToken({
    email,
  });
  res.cookie("emailToken", token, { httpOnly: true }).render("verificacion");
});

export default router;
