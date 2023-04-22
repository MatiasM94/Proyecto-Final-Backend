import Cart from "../models/carts.models.js";

class CartManager {
  async find() {
    const carts = await Cart.find();
    return carts;
  }

  async findById(cid) {
    const carts = await Cart.findById(cid).populate("products.product");
    return carts;
  }

  async create(newCart) {
    return await Cart.create(newCart);
  }

  async update(cid, cart) {
    return await Cart.updateOne(cid, cart);
  }

  async updateOne(cid, newCart) {
    return await Cart.updateOne(cid, newCart);
  }
  async deleteOne(cid) {
    return await Cart.deleteOne(cid);
  }
}

export default CartManager;
