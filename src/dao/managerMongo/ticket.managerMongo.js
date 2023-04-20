import Ticket from "../models/ticket.model.js";

class TicketManager {
  async create(newTicket) {
    return await Ticket.create(newTicket);
  }

  async findById(tid) {
    const ticket = await Ticket.findById(tid);
    return ticket;
  }
}

export default TicketManager;
