import { Server } from "socket.io";
import ChatManager from "../dao/managerMongo/chat.managerMongo.js";
import ProductManager from "../dao/managerFileSystem/productManager.js";

const productClass = new ProductManager();
const chatClass = new ChatManager();
let io;

export function connectionSocket(httpServer) {
  io = new Server(httpServer);
  io.on("connection", async (socket) => {
    console.log("nuevo cliente conectado");
    const productsInJson = await productClass.getProducts();
    const chatInDb = await chatClass.find();
    socket.emit("realTimeProducts", {
      productsInJson,
      style: "home.css",
    });
    socket.emit("init-chat", chatInDb);
  });
}

export const emitAddProduct = (newProduct) => {
  io.emit("addProduct", {
    newProduct,
    style: "home.css",
  });
  return true;
};

export const emitDeleteProduct = (productDelete) => {
  io.emit("deleteProduct", {
    productDelete,
    styles: "home.css",
  });
};

export const emitSendMessage = (newMessage) => {
  io.emit("new-message", newMessage);
};
