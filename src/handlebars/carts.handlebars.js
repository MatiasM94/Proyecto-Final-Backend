import { Router } from "express";
import CartManager from "../dao/managerMongo/cart.managerMongo.js";
import { passportCall } from "../config/passportCall.js";
import { autorization } from "../middlewares/autorization.middleware.js";
import { cartService } from "../repositories/index.js";

const cartClass = new CartManager();

const router = Router();

router.get(
  "/carts/:cid",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { cid } = req.params;

      const cartsInMongo = await cartService.findById(cid);
      if (!cartsInMongo)
        return res
          .status(400)
          .json({ message: `the cart with id ${cid} does not exist` });

      const { products } = cartsInMongo;

      const productos = products.map((producto) => ({
        _id: producto.product._id,
        title: producto.product.title,
        description: producto.product.description,
        price: producto.product.price,
        quantity: producto.quantity,
      }));
      const totalPrice = productos.reduce(
        (acc, current) => acc + current.price * current.quantity,
        0
      );

      res.render("carts", { productos, style: "home.css", totalPrice, cid });
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
