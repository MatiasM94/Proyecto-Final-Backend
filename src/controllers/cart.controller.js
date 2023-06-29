import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { autorization } from "../middlewares/autorization.middleware.js";
import { cartService, ticketService } from "../repositories/index.js";
import { passportCall } from "../config/passportCall.js";
import { generateToken } from "../utils/jwt.js";

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
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.get(
  "/:cid",
  passportCall("current"),
  autorization(["user", "admin", "premium"]),
  async (req, res) => {
    try {
      const { cid } = req.params;

      const cartsInMongo = await cartService.findById(cid);

      if (cartsInMongo.error) {
        req.logger.warn(cartsInMongo.error);
        return res.status(400).json(cartsInMongo);
      }

      if (cartsInMongo) return res.status(200).json(cartsInMongo);
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.post(
  "/",
  passportCall("current"),
  autorization(["user", "premium"]),
  async (req, res) => {
    try {
      const { pid } = req.body;
      const { _id, role } = req.user.payload;
      const userInfo = { _id, role };

      const addProductInCart = await cartService.create(pid, userInfo);

      if (addProductInCart.error) {
        req.logger.warn(addProductInCart.error);
        return res.status(400).json(addProductInCart);
      }
      const token = generateToken({
        _id: addProductInCart.cartAdded._id.toString(),
      });

      req.logger.info("The cart has been created successfully");
      res
        .cookie("cartId", token, { maxAge: 60000 * 6, httpOnly: true })
        .status(201)
        .json(addProductInCart);
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.patch(
  "/:cid",
  passportCall("current"),
  autorization(["user", "premium"]),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const { pid } = req.body;

      const updateCart = await cartService.updateProductInCart(cid, pid);

      if (updateCart.error) {
        req.logger.warn(updateCart.error);
        return res.status(400).json(updateCart);
      }

      res.status(200).json({
        message: updateCart.message,
      });
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.patch(
  "/:cid/product/:pid",
  passportCall("current"),
  autorization(["user", "premium"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity = 0 } = req.body;

      const updateCart = await cartService.updateProductInCart(
        cid,
        pid,
        quantity
      );

      if (updateCart.error) {
        req.logger.warn(updateCart.error);
        return res.status(400).json(updateCart);
      }

      res.status(200).json(updateCart);
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.delete(
  "/:cid/product/:pid",
  passportCall("current"),
  autorization(["user", "premium"]),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;

      const deleteProductInCart = await cartService.deleteProductInCart(
        cid,
        pid
      );

      if (deleteProductInCart.error) {
        req.logger.warn(deleteProductInCart.error);
        return res.status(400).json(deleteProductInCart);
      }

      res.json({ deleteProductInCart });
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
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

      if (deleteCart.error) {
        req.logger.warn(deleteCart.error);
        return res.status(400).json(deleteCart);
      }

      res.status(200).json(deleteCart);
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.post(
  "/:cid/purchase",
  passportCall("current"),
  autorization(["user", "premium"]),
  async (req, res) => {
    const { email } = req.user.payload;
    const { cid } = req.params;
    const { priceFinally } = req.body;

    try {
      const ticketInfo = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        amount: priceFinally,
        purchaser: email,
      };
      const ticket = await ticketService.create(ticketInfo, cid);
      res.status(201).json({ ticket });
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
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
