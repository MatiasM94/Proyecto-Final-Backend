import { Router } from "express";
import { passportCall } from "../config/passportCall.js";

const router = Router();

router.post("/register", passportCall("register"), async (req, res) => {
  const { user } = req;
  try {
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: `Algo a fallado, ${error}` });
  }
});

export default router;
