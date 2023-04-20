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

  async create(ticket) {
    try {
      const newTicket = await this.dao.create(ticket);
      return { message: "generated ticket", newTicket };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default TicketRepository;
