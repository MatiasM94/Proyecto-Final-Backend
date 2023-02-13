import { Router } from "express";
import ChatManager from "../dao/managerMongo/chat.managerMongo.js";
import { emitSendMessage } from "../socketio/socket.io.js";

const chatClass = new ChatManager();

const router = Router();

router.get("/chat", async (req, res) => {
  res.render("chat", { style: "home.css" });
});

router.post("/chat/sendmessage", async (req, res) => {
  const { user, message } = req.body;
  const sendMessage = { user, message };
  emitSendMessage(sendMessage);
  await chatClass.create(sendMessage);
  res.json({ message: "Mensaje enviado" });
});

export default router;
