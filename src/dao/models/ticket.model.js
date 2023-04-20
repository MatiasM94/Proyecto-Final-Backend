import mongoose from "mongoose";

const ticketCollection = "ticket";

const ticketSchema = mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datetime: String,
  amount: Number,
  purchaser: String,
});

const Ticket = mongoose.model(ticketCollection, ticketSchema);

export default Ticket;
