import Cart from "../models/carts.models.js";

class CartManager {
  async find() {
    try {
      const carts = Cart.find();
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async findById(cid) {
    try {
      const carts = await Cart.findById(cid).exec();
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async create(newCart) {
    try {
      await Cart.create(newCart);

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOne(cid, newCart) {
    try {
      await Cart.updateOne({ _id: cid }, newCart);

      return;
    } catch (error) {
      console.log(error);
    }
  }
}

export default CartManager;
