import mongoose from "mongoose";

const cartCollection = "cart";

const cartSchema = mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
        active: Boolean,
      },
    ],
    default: [],
  },
});

const Cart = mongoose.model(cartCollection, cartSchema);

export default Cart;
