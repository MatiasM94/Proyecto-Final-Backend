import Message from "../models/messages.model.js";

class ChatManager {
  async find() {
    try {
      const messages = await Message.find();
      return messages;
    } catch (error) {
      console.log(error);
    }
  }

  async create(message) {
    try {
      await Message.create(message);
    } catch (error) {
      console.log(error);
    }
  }
}

export default ChatManager;
