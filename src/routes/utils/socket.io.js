import { Server } from "socket.io";
import ProductManager from "../../productManager.js";

const productClass = new ProductManager();
let io;

export function connectionSocket(httpServer) {
  io = new Server(httpServer);
  io.on("connection", async (socket) => {
    console.log("nuevo cliente conectado");
    const productsInJson = await productClass.getProducts();
    socket.emit("realTimeProducts", {
      productsInJson,
      style: "home.css",
    });
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
