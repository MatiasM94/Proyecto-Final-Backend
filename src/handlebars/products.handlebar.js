import { Router } from "express";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";

const productClass = new ProductManager();

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, ...rest } = req.query;

    const productsInMongo = await productClass.find(limit, page, sort, rest);

    if (!productsInMongo)
      return res.status(400).json({ message: "no products found" });

    const { docs, prevPage, nextPage } = productsInMongo;

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
      prevPage,
      nextPage,
      style: "home.css",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
