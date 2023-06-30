import mongoose from "mongoose";
import { mongodb, persistence } from "../config/app/index.js";

export let Products;
export let Users;
export let Carts;
export let Tickets;
console.log(persistence);
switch (persistence) {
  case "MONGO":
    mongoose
      .connect(mongodb.mongoConnect)
      .then(() =>
        console.log("The connection to the database has been successful")
      )
      .catch((err) => console.log("Connection error", err));

    const { default: ProductManager } = await import(
      "./managerMongo/product.managerMongo.js"
    );
    const { default: UserManager } = await import(
      "./managerMongo/user.managerMongo.js"
    );
    const { default: CartManager } = await import(
      "./managerMongo/cart.managerMongo.js"
    );
    const { default: TicketManager } = await import(
      "./managerMongo/ticket.managerMongo.js"
    );
    Products = ProductManager;
    Users = UserManager;
    Carts = CartManager;
    Tickets = TicketManager;
    break;
  case "FS":
    console.log(`Entorno de ${persistence}`);
    const { default: ProductsManager } = await import(
      "./managerFileSystem/productManager.js"
    );
    Products = ProductsManager;
    break;

  default:
    mongoose
      .connect(mongodb.mongoConnect)
      .then(() =>
        console.log("The connection to the database has been successful")
      )
      .catch((err) => console.log("Connection error", err));

    const { default: Product } = await import(
      "./managerMongo/product.managerMongo.js"
    );
    const { default: User } = await import(
      "./managerMongo/user.managerMongo.js"
    );
    const { default: Cart } = await import(
      "./managerMongo/cart.managerMongo.js"
    );
    const { default: Ticket } = await import(
      "./managerMongo/ticket.managerMongo.js"
    );
    Products = Product;
    Users = User;
    Carts = Cart;
    Tickets = Ticket;
    break;
}
