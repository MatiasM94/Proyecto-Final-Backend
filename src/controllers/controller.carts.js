import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { autorization } from "../middlewares/autorization.middleware.js";
import { cartService, ticketService } from "../repositories/index.js";
import { passportCall } from "../config/passportCall.js";

const router = Router();

router.get(
  "/",
  passportCall("current"),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const cartsInMongo = await cartService.find();

      res.json(cartsInMongo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/:cid",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;

      const cartsInMongo = await cartService.findById(cid);

      if (cartsInMongo) return res.status(200).json(cartsInMongo);

      res.status(400).json(cartsInMongo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { pid } = req.body;

      const addProductInCart = await cartService.create(pid);

      if (addProductInCart.error) {
        return res.status(400).json(addProductInCart);
      }

      res.status(201).json(addProductInCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  "/:cid",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.body;

      const updateCart = await cartService.updateProductInCart(cid, pid);

      if (updateCart.error) {
        return res.status(400).json(updateCart);
      }

      res.status(200).json({
        message: updateCart.message,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.patch(
  "/:cid/product/:pid",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity = 0 } = req.body;

      const updateCart = await cartService.updateProductInCart(
        cid,
        pid,
        quantity
      );

      if (updateCart.error) return res.status(400).json(updateCart);

      res.status(200).json(updateCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/:cid/product/:pid",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;

      const deleteProductInCart = await cartService.deleteProductInCart(
        cid,
        pid
      );

      if (deleteProductInCart.error) {
        return res.status(400).json(deleteProductInCart);
      }

      res.json({ deleteProductInCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/:cid",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;

      const deleteCart = await cartService.deleteOne(cid);

      if (deleteCart.error) return res.status(400).json(deleteCart);

      res.status(200).json(deleteCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/:cid/purchase",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    const { email } = req.user.payload;
    const { priceFinally, id } = req.body;
    console.log(req.body);
    try {
      const ticketInfo = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: priceFinally,
        purchaser: email,
      };
      const ticket = await ticketService.create(ticketInfo, id);
      console.log(ticket);

      res.json({ ticket });
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
