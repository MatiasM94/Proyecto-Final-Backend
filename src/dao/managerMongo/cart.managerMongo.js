import Cart from "../models/carts.models.js";

class CartManager {
  async find() {
    const carts = Cart.find();
    return carts;
  }

  async findById(cid) {
    const carts = await Cart.findById({ _id: cid }).populate(
      "products.product"
    );
    return carts;
  }

  async create(newCart) {
    return await Cart.create(newCart);
  }

  async updateOne(cid, newCart) {
    return await Cart.updateOne({ _id: cid }, newCart);
  }
  async deleteOne(cid) {
    return await Cart.deleteOne({ _id: cid });
  }
}

export default CartManager;
