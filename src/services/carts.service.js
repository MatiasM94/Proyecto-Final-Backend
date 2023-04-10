import {
  createPersistCart,
  deleteOnePersistCart,
  findByIdPersistCart,
  findPersistCart,
  updatePersistCart,
} from "../persists/cart.persist.js";
import {
  findByIdPersistProduct,
  updateOnePersistProduct,
} from "../persists/product.persist.js";
import {
  addQuantity,
  indexPosition,
  productInCart,
} from "../utils/controllers.utils.js";
import { findById } from "./products.service.js";

const findCarts = async () => {
  const cartsInMongo = await findPersistCart();
  if (cartsInMongo.length > 0)
    return { message: `carts available:`, cartsInMongo };
};

const findByIdCart = async (cid) => {
  const cartsInMongo = await findByIdPersistCart({ _id: cid });

  if (!cartsInMongo) return { Error: `the cart with id ${cid} does not exist` };

  return cartsInMongo;
};

const createCart = async (product) => {
  const newCart = { products: [{ product, quantity: 1 }] };
  const cartAdded = await createPersistCart(newCart);

  return { message: "cart created successfully", cartAdded };
};

const updateOne = async (products, product, cid, cart, quantity) => {
  const productPosition = indexPosition(products, product);
  if (productPosition !== -1) {
    return addQuantity({
      products,
      productPosition,
      cid,
      cart,
      product,
      quantity,
    });
  }

  products.push({ product: product, quantity: 1 });

  const updateCart = await updatePersistCart({ _id: cid }, cart);

  return {
    message: `the product with id ${product} was added successfully`,
    updateCart,
  };
};

const deleteProductInCart = async (products, pid, cart, cid) => {
  const productInCartExist = productInCart(products, pid);
  if (!productInCartExist) {
    return {
      error: `the product with id ${pid} does not exist in the cart`,
    };
  }

  cart.products = products.filter(
    (product) => product.product._id.toString() != pid
  );

  const modifiedCart = await updatePersistCart({ _id: cid }, cart);
  return {
    message: `The product with id ${pid} was deleted `,
    modifiedCart,
  };
};

const deleteOneCart = async (cid) => {
  const deletedCart = deleteOnePersistCart({ _id: cid });
  return { message: `the cart with id ${cid} was deleted` };
};

export {
  findCarts,
  findByIdCart,
  createCart,
  updateOne,
  deleteProductInCart,
  deleteOneCart,
};
