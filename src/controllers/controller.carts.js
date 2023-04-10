import { Router } from "express";
import CartManager from "../dao/managerMongo/cart.managerMongo.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";
import FilesManager from "../dao/files.manager.js";
import Cart from "../dao/models/carts.models.js";
import {
  createCart,
  deleteOneCart,
  deleteProductInCart,
  findByIdCart,
  findCarts,
  updateOne,
} from "../services/carts.service.js";
import { findById } from "../services/products.service.js";
import passport from "passport";
import { autorization } from "../middlewares/autorization.middleware.js";

const cartClass = new CartManager();
const productClass = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const cartsInMongo = await findCarts();

    res.json(cartsInMongo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/:cid",
  passport.authenticate("current", { session: false }),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const cartsInMongo = await findByIdCart(cid);

      if (cartsInMongo) return res.status(200).json(cartsInMongo);

      res.status(400).json(cartsInMongo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/",
  passport.authenticate("current", { session: false }),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { pid } = req.body;

      const productInMongo = await findById(pid);

      if (productInMongo.error) {
        return res.status(400).json(productInMongo);
      }

      const cartAdded = await createCart(pid);

      res.status(201).json(cartAdded);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  "/:cid",
  passport.authenticate("current", { session: false }),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const { product } = req.body;

      const productExist = await findById(product);
      if (productExist.error) {
        return res.status(400).json(productExist);
      }

      const cartExist = await findByIdCart(cid);
      if (cartExist.error) return res.status(400).json(cartExist);

      const { products } = cartExist;
      const updateCart = await updateOne(products, product, cid, cartExist);

      return res.status(200).json({ updateCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity = 0 } = req.body;

      const cartExist = await findByIdCart(cid);
      if (cartExist.error) return res.status(400).json(cartExist);

      const { products } = cartExist;

      const productExist = await findById(pid);
      if (productExist.error) {
        return res.status(400).json(productExist);
      }

      const updateCart = await updateOne(
        products,
        pid,
        cid,
        cartExist,
        quantity
      );

      res.status(200).json(updateCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;

      const productExist = await findById(pid);
      if (productExist.error) {
        return res.status(400).json(productExist);
      }

      const cartExist = await findByIdCart(cid);
      if (cartExist.error) return res.status(400).json(cartExist);

      const { products } = cartExist;

      const productInCartExist = await deleteProductInCart(
        products,
        pid,
        cartExist,
        cid
      );

      if (productInCartExist.error) {
        return res.status(400).json({
          productInCartExist,
        });
      }

      res.json({ productInCartExist });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/:cid",
  passport.authenticate("current", { session: false }),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;

      const cartExist = await findByIdCart(cid);
      if (cartExist.error) return res.status(400).json(cartExist);

      const deletedCart = await deleteOneCart(cid);

      res.status(200).json(deletedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

// router.post("/allcarts", async (req, res) => {
//   try {
//     const cartsFileManager = new FilesManager("carts.json");
//     const carts = await cartsFileManager.loadItems();

//     await Cart.insertMany(carts);

//     res.status(201).json({ message: "carts added successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
