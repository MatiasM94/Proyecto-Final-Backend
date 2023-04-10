import Cart from "../dao/models/carts.models.js";

const findPersistCart = async () => {
  const carts = await Cart.find();
  return carts;
};

const findByIdPersistCart = async (cid) => {
  const carts = await Cart.findById(cid).populate("products.product");
  return carts;
};

const createPersistCart = async (newCart) => {
  const createCart = await Cart.create(newCart);
  return createCart;
};

const updatePersistCart = async (cid, cart) => {
  const updateCart = await Cart.updateOne(cid, cart);
  return updateCart;
};

const deleteOnePersistCart = async (cid) => {
  const deleteCart = await Cart.deleteOne(cid);
  return deleteCart;
};

export {
  findPersistCart,
  findByIdPersistCart,
  createPersistCart,
  updatePersistCart,
  deleteOnePersistCart,
};
