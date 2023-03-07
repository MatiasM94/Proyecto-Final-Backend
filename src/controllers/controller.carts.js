import { Router } from "express";
import CartManager from "../dao/managerMongo/cart.managerMongo.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";
import FilesManager from "../dao/files.manager.js";
import Cart from "../dao/models/carts.models.js";
import {
  addQuantity,
  cartInDb,
  indexPosition,
  productInCart,
  productInDb,
} from "../utils/controllers.utils.js";

const cartClass = new CartManager();
const productClass = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const cartsInMongo = await cartClass.find();

    res.json({ message: `carts available:`, cartsInMongo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cartsInMongo = await cartClass.findById(cid);

    if (cartsInMongo) return res.send({ cartsInMongo });

    res.send({ Error: `the cart with id ${cid} does not exist` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/allcarts", async (req, res) => {
  try {
    const cartsFileManager = new FilesManager("carts.json");
    const carts = await cartsFileManager.loadItems();

    await Cart.insertMany(carts);

    res.status(201).json({ message: "carts added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { product } = req.body;

    const productInMongo = await productClass.findById(product);

    if (!productInMongo) {
      return res
        .status(400)
        .json({ message: `the product with id ${pid} does not exist` });
    }

    const newCart = { products: [{ product, quantity: 1 }] };
    const cartAdded = await cartClass.create(newCart);

    res.json({ message: "cart created successfully", cartAdded });
    return;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { product } = req.body;

    const productExist = await productInDb(res, product);
    if (!productExist) return;
    // const productInMongo = await productClass.findById(product);

    // if (!productInMongo) {
    //   return res
    //     .status(400)
    //     .json({ message: `the product with id ${product} does not exist` });
    // }

    const cartExist = await cartInDb(res, cid);
    if (!cartExist) return;
    const { products, cart } = cartExist;
    // const cart = await cartClass.findById(cid);
    // if (!cart)
    //   return res.json({ message: `the cart with id ${cid} does not exist` });
    // const { products } = cart;
    const productPosition = await indexPosition(products, product);
    // const indexPosition = products.findIndex(
    //   (product) => product.product._id.toString() === req.body.product
    // );

    if (productPosition !== -1) {
      addQuantity({ res, products, productPosition, cid, cart, product });
      // products[productPosition].quantity += 1;

      // await cartClass.updateOne(cid, cart);

      // res.json({
      //   message: `increase by 1 the quantity of the product ${product}`,
      // });
      return;
    }

    products.push({ product: product, quantity: 1 });
    await cartClass.updateOne(cid, cart);

    return res.json({ message: "product added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 0 } = req.body;

    const cartExist = await cartInDb(res, cid);
    if (!cartExist) return;
    const { products, cart } = cartExist;
    // const cart = await cartClass.findById(cid);
    // if (!cart)
    //   return res.json({ message: `the cart with id ${cid} does not exist` });
    // const { products } = cart;

    const productExist = await productInDb(res, pid);
    if (!productExist) return;

    // const productInMongo = await productClass.findById(pid);
    // if (!productInMongo) {
    //   return res
    //     .status(400)
    //     .json({ message: `the product with id ${pid} does not exist` });
    // }
    const productPosition = await indexPosition(products, pid);

    if (productPosition !== -1) {
      addQuantity({ res, products, productPosition, cid, cart, quantity, pid });
      return;
    }

    // const indexPosition = products.findIndex(
    //   (product) => product.product._id.toString() === pid
    // );

    // if (indexPosition !== -1) {
    //   products[indexPosition].quantity += quantity;

    //   await cartClass.updateOne(cid, cart);
    //   res.json({
    //     message: `increase by ${quantity} the quantity of the product ${pid}`,
    //   });
    //   return;
    // }
    return res.json({
      message: `the product with id ${pid} does not exist in the cart`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const productExist = await productInDb(res, pid);
    if (!productExist) return;

    // const productInMongo = await productClass.findById(pid);
    // if (!productInMongo) {
    //   return res
    //     .status(400)
    //     .json({ message: `the product with id ${pid} does not exist` });
    // }

    const cartExist = await cartInDb(res, cid);
    if (!cartExist) return;
    const { products, cart } = cartExist;

    // const cart = await cartClass.findById(cid);
    // if (!cart)
    //   return res.json({ message: `the cart with id ${cid} does not exist` });

    const productInCartExist = productInCart(products, pid);

    if (!productInCartExist) {
      return res.status(400).json({
        message: `the product with id ${pid} does not exist in the cart`,
      });
    }
    // const productInCart = cart.products.some(
    //   (product) => product.product._id.toString() === pid
    // );

    // if (!productInCart) {
    //   return res.status(400).json({
    //     message: `the product with id ${pid} does not exist in the cart`,
    //   });
    // }

    cart.products = products.filter(
      (product) => product.product._id.toString() != pid
    );

    await cartClass.updateOne(cid, cart);

    return res.json({
      message: `The product with id ${pid} was deleted `,
      cart,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cartExist = await cartInDb(res, cid);
    if (!cartExist) return;
    // const cartsInMongo = await cartClass.findById(cid);

    // if (!cartsInMongo) {
    //   return res
    //     .status(400)
    //     .json({ message: `the cart with id ${cid} does not exist` });
    // }

    const deletedCart = await cartClass.deleteOne(cid);

    res.json({ message: `the cart with id ${cid} was deleted`, deletedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
