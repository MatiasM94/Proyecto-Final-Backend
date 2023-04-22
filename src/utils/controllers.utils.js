import ProductManager from "../dao/managerMongo/product.managerMongo.js";
import CartManager from "../dao/managerMongo/cart.managerMongo.js";

const productClass = new ProductManager();
const cartClass = new CartManager();

export async function productInDb(res, product) {
  const productInMongo = await productClass.findById(product);

  if (!productInMongo) {
    res
      .status(400)
      .json({ message: `the product with id ${product} does not exist` });
    return false;
  }

  return productInMongo;
}

export async function cartInDb(res, cid) {
  const cart = await cartClass.findById(cid);
  if (!cart) {
    res.json({ message: `the cart with id ${cid} does not exist` });
    return false;
  }
  const { products } = cart;
  return { cart, products };
}

export function indexPosition(products, product) {
  return products.findIndex(
    (producto) => producto.product._id.toString() === product
  );
}

export async function addQuantity({
  products,
  productPosition,
  quantity = 0,
  cid,
  cart,
  product,
  pid,
}) {
  products[productPosition].quantity += quantity ? quantity : 1;

  await updatePersistCart({ _id: cid }, cart);

  return {
    message: `increase by ${quantity || 1} the quantity of the product ${
      product || pid
    }`,
  };
}

export function productInCart(products, pid) {
  return products.some((product) => product.product._id.toString() === pid);
}
