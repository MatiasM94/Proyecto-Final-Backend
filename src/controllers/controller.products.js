import { Router } from "express";
import { autorization } from "../middlewares/autorization.middleware.js";
import { productService } from "../repositories/index.js";
import { passportCall } from "../config/passportCall.js";

const router = Router();

router.get(
  "/",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { limit, page, sort, ...rest } = req.query;
      const productsInDb = await productService.find(limit, page, sort, rest);

      if (productsInDb.error) return res.status(400).json(productsInDb);

      res.json(productsInDb);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/:pid",
  passportCall("current"),
  autorization(["user", "admin"]),
  async (req, res) => {
    try {
      const { pid } = req.params;

      const filteredProduct = await productService.findById(pid);

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
  passportCall("current"),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const product = req.body;

      const newProduct = await productService.create(product);
      if (newProduct.error) return res.status(400).json(newProduct.error);

      res.json(newProduct);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
);

router.put(
  "/:pid",
  passportCall("current"),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const updatedProductInfo = req.body;

      const updateProduct = await productService.updateOne(
        pid,
        updatedProductInfo
      );
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
  passportCall("current"),
  autorization(["admin"]),
  async (req, res) => {
    try {
      const { pid } = req.params;
      const deleteProduct = await productService.deleteOne(pid);
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
