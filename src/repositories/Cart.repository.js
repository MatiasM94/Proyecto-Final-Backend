import {
  addQuantity,
  indexPosition,
  productInCart,
} from "../utils/controllers.utils.js";
import { productService } from "./index.js";

class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async find() {
    try {
      const cartsInDb = await this.dao.find();
      if (cartsInDb.length > 0)
        return { message: `carts available:`, cartsInDb };
    } catch (error) {
      throw new Error(error);
    }
  }

  async findById(cid) {
    try {
      const cart = await this.dao.findById(cid);
      if (cart) return cart;

      return { error: `The cart with id ${cid} does not exist` };
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(pid) {
    try {
      const productInDb = productService.find(pid);

      if (!productInDb)
        return { error: `The product with id ${pid} does not exist` };

      const newCart = { products: [{ product: pid, quantity: 1 }] };

      const cartAdded = await this.dao.create(newCart);

      return { message: "cart created successfully", cartAdded };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateOne(product, cid) {
    try {
      const productInDb = await productService.findById(product);

      if (!productInDb)
        return { error: `The product with id ${product} does not exist` };

      const cart = await this.findById(cid);
      if (cart.error) return cart;

      const { products } = cart;

      const productPosition = indexPosition(products, product);
      if (productPosition !== -1) {
        return {
          error: `the product whit id ${product} already exists in the cart`,
        };
      }

      products.push({ product: product, quantity: 1 });
      const updateCart = await this.dao.updateOne({ _id: cid }, cart);

      return {
        message: `the product with id ${product} was added successfully`,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateProductInCart(cid, pid, quantity) {
    try {
      const productInDb = await productService.find(pid);
      if (!productInDb)
        return { error: `The product with id ${pid} does not exist` };

      const cart = await this.findById(cid);
      if (cart.error) return cart;

      const { products } = cart;

      const productPosition = indexPosition(products, pid);
      if (productPosition !== -1) {
        products[productPosition].quantity += quantity ? quantity : 1;
        const updateCart = await this.dao.updateOne({ _id: cid }, cart);
        return {
          message: `the product with id ${pid} was modified successfully`,
          cart,
        };
      }

      return { error: "the product does not exist in the cart" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteProductInCart(cid, pid) {
    try {
      const productInDb = await productService.find(pid);
      if (!productInDb)
        return { error: `The product with id ${pid} does not exist` };

      const cart = await this.findById(cid);
      if (cart.error) return cart;

      const { products } = cart;

      const productInCartExist = productInCart(products, pid);
      if (!productInCartExist) {
        return {
          error: `the product with id ${pid} does not exist in the cart`,
        };
      }

      cart.products = products.filter(
        (product) => product.product._id.toString() != pid
      );

      const modifiedCart = await this.dao.updateOne({ _id: cid }, cart);

      return {
        message: `The product with id ${pid} was removed successfully`,
        modifiedCart,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteOne(cid) {
    const cart = await this.findById(cid);
    if (cart.error) return cart;
    const deleteCart = await this.dao.deleteOne({ _id: cid });
    return { message: `the cart with id ${cid} was deleted` };
  }
}

export default CartRepository;
