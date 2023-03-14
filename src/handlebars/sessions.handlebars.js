import { Router } from "express";
import { privateAccess, publicAccess } from "../middlewares/index.js";

const router = Router();

router.get("/profile", privateAccess, (req, res) => {
  const { user } = req.session;

  res.render("profile.handlebars", { user });
});

router.get("/", publicAccess, (req, res) => {
  res.render("login.handlebars");
});

router.get("/signup", publicAccess, (req, res) => {
  res.render("signup.handlebars");
});

router.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword");
});

export default router;
