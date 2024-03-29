import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { autorization } from "../middlewares/autorization.middleware.js";
import { productService } from "../repositories/index.js";
import { passportCall } from "../config/passportCall.js";
import { generateProduct } from "../utils/mock.util.js";
import FilesManager from "../dao/files.manager.js";
import Product from "../dao/models/products.models.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";

const router = Router();

router.get(
  "/",
  passportCall("current"),
  autorization(["user", "admin", "premium"]),
  async (req, res) => {
    try {
      const { limit, page, sort, ...rest } = req.query;
      const productsInDb = await productService.find(limit, page, sort, rest);

      if (productsInDb.error) {
        req.logger.warn(productsInDb.error);
        return res.status(400).json(productsInDb);
      }
      req.logger.debug(productsInDb.payload.docs);
      res.json(productsInDb);
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.get(
  "/:pid",
  passportCall("current"),
  autorization(["user", "admin", "premium"]),
  async (req, res) => {
    try {
      const { pid } = req.params;

      const filteredProduct = await productService.findById(pid);

      if (filteredProduct.error) {
        req.logger.error(filteredProduct.error);
        return res.status(400).json(filteredProduct);
      }

      res.status(200).json(filteredProduct);
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
  autorization(["admin", "premium"]),
  async (req, res) => {
    try {
      const product = req.body;
      const isPremium = {
        role: req.user.payload.role,
        _id: req.user.payload._id,
      };

      const newProduct = await productService.create(product, isPremium);
      if (newProduct.cause) {
        req.logger.error(newProduct.cause);
        return res.status(400).json(newProduct);
      }
      if (newProduct.error) return res.status(400).json(newProduct);
      res.json(newProduct);
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.put(
  "/:pid",
  passportCall("current"),
  autorization(["admin", "premium"]),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const updatedProductInfo = req.body;

      const updateProduct = await productService.updateOne(
        pid,
        updatedProductInfo
      );
      const { productsUpdateCounter, message, error } = updateProduct;

      if (updateProduct.error) {
        req.logger.error(error);
        return res.status(400).json(error);
      }

      return productsUpdateCounter
        ? res.status(200).json(message)
        : res.status(400).json(error);
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);

router.delete(
  "/delete/:pid",
  passportCall("current"),
  autorization(["admin", "premium"]),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const { payload } = req.user;

      const deleteProduct = await productService.deleteOne(pid, payload);
      const { message, error } = deleteProduct;

      if (message) {
        return res.status(200).json(message);
      }
      req.logger.error(error);
      res.status(400).json(error);
    } catch (error) {
      req.logger.error(error.message);
      res
        .status(500)
        .json({ error: "An internal problem occurred on the server" });
    }
  }
);
router.get(
  "/mock/mockingproducts",
  passportCall("current"),
  autorization(["admin"]),
  (req, res) => {
    const product = generateProduct();
    res.json({ message: product });
  }
);

router.post("/allproducts", async (req, res) => {
  try {
    const productsFileManager = new FilesManager("Products.json");
    const products = await productsFileManager.loadItems();
    const dtoProducts = products.map((product) => ({
      ...product,
      stock: 50,
      code: uuidv4(),
    }));
    await Product.insertMany(dtoProducts);

    res.status(201).json({ message: "products added successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
export default router;

router.delete("/allproducts", async (req, res) => {
  try {
    const productMan = new ProductManager();
    await productMan.deleteMany();

    res.json({ message: "all products have been removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
