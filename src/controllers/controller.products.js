import { Router } from "express";
import passport from "passport";
import FilesManager from "../dao/files.manager.js";
import Product from "../dao/models/products.models.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";
import {
  createProduct,
  deleteOne,
  findById,
  findProducts,
  updateOne,
} from "../services/products.service.js";
import { autorization } from "../middlewares/autorization.middleware.js";

const router = Router();

router.get(
  "/",
  passport.authenticate("current", { session: false }),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { limit, page, sort, ...rest } = req.query;
      const productsInDb = await findProducts(limit, page, sort, rest);

      if (productsInDb.error) return res.status(400).json(productsInDb);

      res.json(productsInDb);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/:pid",
  passport.authenticate("current", { session: false }),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { pid } = req.params;

      const filteredProduct = await findById(pid);

      if (filteredProduct.error)
        return res.status(400).json({ filteredProduct });

      res.status(200).json(filteredProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/",
  passport.authenticate("current", { session: false }),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        status,
        thumbnails,
        code,
        stock,
        category,
      } = req.body;
      const newProductInfo = {
        title,
        description,
        price,
        status,
        thumbnails,
        code,
        stock,
        category,
      };

      const newProduct = await createProduct(newProductInfo);
      if (newProduct.error) return res.status(400).json(newProduct);

      res.json(newProduct);
    } catch (error) {
      if (error.code === 11000)
        return res.status(400).json({ error: "El producto ya existe" });

      res.status(500).json({ error: error });
    }
  }
);

router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const {
        title,
        description,
        price,
        status,
        thumbnails,
        code,
        stock,
        category,
      } = req.body;
      const updatedProduct = {
        title,
        description,
        price,
        status,
        thumbnails,
        code,
        stock,
        category,
      };

      const updateProduct = await updateOne(pid, updatedProduct);
      const { productsUpdateCounter, message, error } = updateProduct;

      if (updateProduct.error) return res.status(400).json(error);

      return productsUpdateCounter
        ? res.status(200).json(message)
        : res.status(400).json(error);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.delete(
  "/delete/:pid",
  passport.authenticate("current", { session: false }),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const deleteProduct = await deleteOne(pid);
      const { deletedCount, message, error } = deleteProduct;

      if (deletedCount) {
        return res.status(200).json(message);
      }

      res.status(400).json(error);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

// router.post("/allproducts", async (req, res) => {
//   try {
//     const productsFileManager = new FilesManager("Products.json");
//     const products = await productsFileManager.loadItems();

//     await Product.insertMany(products);

//     res.status(201).json({ message: "products added successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.delete("/allproducts", async (req, res) => {
//   try {
//     await productsClass.deleteMany();

//     res.json({ message: "all products have been removed" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
