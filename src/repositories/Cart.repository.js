import { indexPosition, productInCart } from "../utils/controllers.utils.js";
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

  async create(pid, userInfo) {
    const { _id, role } = userInfo;
    const isPremium = "premium";
    try {
      const productInDb = await productService.findById(pid);
      if (!productInDb)
        return { error: `The product with id ${pid} does not exist` };
      const quantity = 1;
      const active = true;
      const newCart = { products: [{ product: pid, quantity, active }] };
      if (productInDb.stock === 0) return { error: "no hay stock disponible" };
      const productOwner = productInDb.owner?._id.toString();

      if (isPremium === role && productOwner === _id) {
        return { error: "no puedes agregar tus productos al carrito" };
      }

      const cartAdded = await this.dao.create(newCart);

      productInDb.stock -= quantity;

      const newStock = await productService.updateOne(pid, productInDb);

      // Despues de 5 minutos si el producto sigue en el cart, se elimina del mismo
      setTimeout(async () => {
        const cartId = cartAdded._id.toString();

        const cart = await this.findById(cartId);
        const { products } = cart;

        if (products.length === 0) return;
        const productPosition = indexPosition(products, pid);

        if (!products[productPosition]) return;

        if (products[productPosition].active) {
          const currentProductInDb = await productService.findById(pid);

          currentProductInDb.stock += quantity;
          const newStock = await productService.updateOne(
            pid,
            currentProductInDb
          );

          products[productPosition].quantity -= quantity;
          const updateCart = await this.dao.updateOne({ _id: cartId }, cart);

          if (products[productPosition].quantity === 0) {
            const deleteProductInCart = await this.deleteProductInCart(
              cartId,
              pid
            );
          }
        }
      }, 5 * 60000);

      return { message: "cart created successfully", cartAdded };
    } catch (error) {
      return error;
    }
  }

  async update(cid, cart) {
    try {
      const updateCart = await this.dao.update({ _id: cid }, cart);
      return updateCart;
    } catch (error) {
      return error;
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

  async updateProductInCart(cid, pid, quantity = 1) {
    try {
      const productInDb = await productService.findById(pid);
      if (productInDb.error)
        return { error: `The product with id ${pid} does not exist` };

      if (productInDb.stock === 0) return { error: "no hay stock disponible" };

      const cart = await this.findById(cid);
      if (cart.error) return cart;

      const { products } = cart;

      const productPosition = indexPosition(products, pid);

      if (productPosition !== -1) {
        if (Number(quantity) >= 1) {
          productInDb.stock -=
            Number(quantity) - Number(products[productPosition].quantity);
          products[productPosition].quantity = quantity;

          const updateCart = await this.dao.updateOne({ _id: cid }, cart);

          const newStock = await productService.updateOne(pid, productInDb);
        } else {
          products[productPosition].quantity += quantity;
          const updateCart = await this.dao.updateOne({ _id: cid }, cart);

          productInDb.stock -= quantity;

          const newStock = await productService.updateOne(pid, productInDb);
        }

        setTimeout(async () => {
          const cart = await this.findById(cid);
          if (cart.error) return cart;

          const { products } = cart;
          if (products.length === 0) return;

          const productPosition = indexPosition(products, pid);

          if (!products[productPosition]) return;

          if (products[productPosition].active) {
            const currentProductInDb = await productService.findById(pid);

            currentProductInDb.stock += Number(quantity);
            const newStock = await productService.updateOne(
              pid,
              currentProductInDb
            );

            products[productPosition].quantity -= Number(quantity);
            const updateCart = await this.dao.updateOne({ _id: cid }, cart);

            if (products[productPosition].quantity <= 0) {
              const deleteProductInCart = await this.deleteProductInCart(
                cid,
                pid
              );
            }
          }
        }, 5 * 60000);

        return {
          message: `the product with id ${pid} was modified successfully`,
          cart,
        };
      }

      const active = true;
      products.push({ product: pid, quantity: 1, active });
      const updateCart = await this.dao.updateOne({ _id: cid }, cart);

      productInDb.stock -= quantity;
      const newStock = await productService.updateOne(pid, productInDb);

      setTimeout(async () => {
        const cart = await this.findById(cid);
        if (cart.error) return cart;
        const { products } = cart;
        if (products.length === 0) return;

        const productPosition = indexPosition(products, pid);

        if (!products[productPosition]) return;

        if (products[productPosition].active) {
          const currentProductInDb = await productService.findById(pid);
          currentProductInDb.stock += Number(quantity);
          const newStock = await productService.updateOne(
            pid,
            currentProductInDb
          );

          products[productPosition].quantity -= quantity;
          const updateCart = await this.dao.updateOne({ _id: cid }, cart);

          if (products[productPosition].quantity === 0) {
            const deleteProductInCart = await this.deleteProductInCart(
              cid,
              pid
            );
          }
          return;
        }
      }, 5 * 60000);

      return {
        message: `the product with id ${pid} was added successfully`,
      };
    } catch (error) {
      return error;
    }
  }

  async deleteProductInCart(cid, pid) {
    try {
      const productInDb = await productService.findById(pid);
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

      const [quantityDelete] = products.filter(
        (product) => product.product._id.toString() === pid
      );

      cart.products = products.filter(
        (product) => product.product._id.toString() != pid
      );

      const modifiedCart = await this.dao.updateOne({ _id: cid }, cart);

      productInDb.stock += Number(quantityDelete.quantity);

      const newStock = await productService.updateOne(pid, productInDb);

      return {
        message: `The product with id ${pid} was removed successfully`,
        modifiedCart,
      };
    } catch (error) {
      return error;
    }
  }

  async deleteOne(cid) {
    try {
      const cart = await this.findById(cid);
      if (cart.error) return cart;

      const deleteCart = await this.dao.deleteOne({ _id: cid });

      return { message: `the cart with id ${cid} was deleted` };
    } catch (error) {
      return error;
    }
  }
}

export default CartRepository;
