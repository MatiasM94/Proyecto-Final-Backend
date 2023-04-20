import { Router } from "express";
import ChatManager from "../dao/managerMongo/chat.managerMongo.js";
import { emitSendMessage } from "../socketio/socket.io.js";
import { passportCall } from "../config/passportCall.js";
import { autorization } from "../middlewares/autorization.middleware.js";

const chatClass = new ChatManager();

const router = Router();

router.get(
  "/chat",
  passportCall("current"),
  autorization(["user"]),
  async (req, res) => {
    res.render("chat", { style: "home.css" });
  }
);

router.post(
  "/chat/sendmessage",
  passportCall("current"),
  autorization(["user"]),
  async (req, res) => {
    const { user, message } = req.body;
    const sendMessage = { user, message };
    emitSendMessage(sendMessage);
    await chatClass.create(sendMessage);
    res.json({ message: "Mensaje enviado" });
  }
);

export default router;
