import { Products, Users, Carts, Tickets } from "../dao/factory.js";
import CartRepository from "./Cart.repository.js";
import ProductRepository from "./Product.repository.js";
import TicketRepository from "./Ticket.repository.js";
import UserRepository from "./User.repository.js";

export const productService = new ProductRepository(new Products());
export const userService = new UserRepository(new Users());
export const cartService = new CartRepository(new Carts());
export const ticketService = new TicketRepository(new Tickets());
