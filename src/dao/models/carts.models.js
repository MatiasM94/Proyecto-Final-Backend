import mongoose from "mongoose";

const cartCollection = "cart";

const cartSchema = mongoose.Schema({
  products: [
    {
      pid: String,
      quantity: Number,
    },
  ],
});

const Cart = mongoose.model(cartCollection, cartSchema);

export default Cart;
