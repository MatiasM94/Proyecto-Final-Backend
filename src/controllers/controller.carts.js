import { Router } from "express";
import CartManager from "../dao/managerMongo/cart.managerMongo.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";
import FilesManager from "../dao/files.manager.js";
import Cart from "../dao/models/carts.models.js";

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

    const productInMongo = await productClass.findById(product);

    if (!productInMongo) {
      return res
        .status(400)
        .json({ message: `the product with id ${product} does not exist` });
    }

    const cart = await cartClass.findById(cid);
    if (!cart)
      return res.json({ message: `the cart with id ${cid} does not exist` });
    const { products } = cart;

    const indexPosition = products.findIndex(
      (product) => product.product._id.toString() === req.body.product
    );

    if (indexPosition !== -1) {
      products[indexPosition].quantity += 1;

      await cartClass.updateOne(cid, cart);

      res.json({
        message: `increase by 1 the quantity of the product ${product}`,
      });
      return;
    }

    products.push({ product: product, quantity: 1 });
    await cartClass.updateOne(cid, cart);

    res.json({ message: "product added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 0 } = req.body;

    const cart = await cartClass.findById(cid);
    if (!cart)
      return res.json({ message: `the cart with id ${cid} does not exist` });
    const { products } = cart;

    const productInMongo = await productClass.findById(pid);
    if (!productInMongo) {
      return res
        .status(400)
        .json({ message: `the product with id ${pid} does not exist` });
    }

    const indexPosition = products.findIndex(
      (product) => product.product._id.toString() === pid
    );

    if (indexPosition !== -1) {
      products[indexPosition].quantity += quantity;

      await cartClass.updateOne(cid, cart);
      res.json({
        message: `increase by ${quantity} the quantity of the product ${pid}`,
      });
      return;
    }
    res.json({
      message: `the product with id ${pid} does not exist in the cart`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const productInMongo = await productClass.findById(pid);
    if (!productInMongo) {
      return res
        .status(400)
        .json({ message: `the product with id ${pid} does not exist` });
    }

    const cart = await cartClass.findById(cid);
    if (!cart)
      return res.json({ message: `the cart with id ${cid} does not exist` });

    const productInCart = cart.products.some(
      (product) => product.product._id.toString() === pid
    );

    if (!productInCart) {
      return res.status(400).json({
        message: `the product with id ${pid} does not exist in the cart`,
      });
    }

    cart.products = cart.products.filter(({ product }) => product._id != pid);
    await cartClass.updateOne(cid, cart);

    res.json({ message: `The product with id ${pid} was deleted `, cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cartsInMongo = await cartClass.findById(cid);

    if (!cartsInMongo) {
      return res
        .status(400)
        .json({ message: `the cart with id ${cid} does not exist` });
    }

    const deletedCart = await cartClass.deleteOne(cid);

    res.json({ message: `the cart with id ${cid} was deleted`, deletedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
