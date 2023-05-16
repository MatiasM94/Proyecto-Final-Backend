import { Router } from "express";
import { passportCall } from "../config/passportCall.js";
import { autorization } from "../middlewares/autorization.middleware.js";
import { userService } from "../repositories/index.js";

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

router.patch(
  "/premium/:uid",
  passportCall("current"),
  autorization(["user", "premium"]),
  async (req, res) => {
    const { uid } = req.params;
    const updateUser = await userService.update(uid);
    res.json({ updateUser });
  }
);

export default router;
