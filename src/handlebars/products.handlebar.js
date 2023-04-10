import { Router } from "express";
import passport from "passport";
import { findProducts } from "../services/products.service.js";

const router = Router();

router.get(
  "/products",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      const { limit, page, sort, ...rest } = req.query;
      const { payload } = req.user;

      const productsInDb = await findProducts(limit, page, sort, rest);

      if (productsInDb.error) return res.status(400).json(productsInDb);

      const { docs, prevPage, nextPage } = productsInDb.payload;

      const productos = docs.map((producto) => ({
        _id: producto._id.toString(),
        title: producto.title,
        description: producto.description,
        price: producto.price,
        status: producto.status,
        stock: producto.stock,
        code: producto.code,
        category: producto.category,
      }));

      res.render("products", {
        products: productos,
        user: payload,
        prevPage,
        nextPage,
        style: "home.css",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
