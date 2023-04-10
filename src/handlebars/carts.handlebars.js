import { Router } from "express";
import passport from "passport";
import CartManager from "../dao/managerMongo/cart.managerMongo.js";

const cartClass = new CartManager();

const router = Router();

router.get(
  "/carts/:cid",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartClass.findById(cid);
      if (!cart)
        return res
          .status(400)
          .json({ message: `the cart with id ${cid} does not exist` });

      const { products } = cart;

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

      res.render("carts", { productos, style: "home.css", totalPrice });
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
