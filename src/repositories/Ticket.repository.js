import { cartService } from "./index.js";

class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async findById(tid) {
    try {
      const ticket = await this.dao.findById(tid);
      if (ticket) return { ticket };

      return { error: `The ticket with id ${tid} does not exist` };
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(ticket, cid) {
    try {
      const newTicket = await this.dao.create(ticket);

      const cart = await cartService.findById(cid);
      console.log("original", cart);
      const { products } = cart;

      // const finishCart = products.map((product) => {
      //   return { products: product.product, active: false };
      // });
      products.forEach((product) => {
        product.active = false;
      });

      console.log("cart.", cart.products);
      console.log("finis", cart);
      const actualizarCart = await cartService.update(cid, cart);
      console.log("sda", products);
      return { message: "generated ticket", newTicket };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default TicketRepository;
