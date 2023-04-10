import { Router } from "express";
import passport from "passport";

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

router.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword");
});

export default router;
