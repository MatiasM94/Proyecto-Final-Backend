import { Router } from "express";
import FilesManager from "../dao/files.manager.js";
import Product from "../dao/models/products.models.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";

const productsClass = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, ...rest } = req.query;
    const productsInDb = await productsClass.find(limit, page, sort, rest);

    if (productsInDb.docs.length > 0) {
      res.json({ status: "Sucess", payload: productsInDb });
      return;
    }
    res.status(400).json({ error: `peticion include an incorrect parm`, rest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const filteredProduct = await productsClass.findById(pid);

    if (filteredProduct) return res.send({ filteredProduct });

    res.send({ Error: `The product with id ${pid} does not exist` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/allproducts", async (req, res) => {
  try {
    const productsFileManager = new FilesManager("Products.json");
    const products = await productsFileManager.loadItems();

    await Product.insertMany(products);

    res.status(201).json({ message: "products added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
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
    const newProduct = {
      title,
      description,
      price,
      status,
      thumbnails,
      code,
      stock,
      category,
    };
    if (
      title &&
      description &&
      price &&
      status &&
      thumbnails &&
      code &&
      stock &&
      category
    ) {
      return (await productsClass.create(newProduct))
        ? res.status(201).json({ message: "Added product" })
        : res.status(400).json({ message: "Repeat product" });
    }

    res
      .status(400)
      .json({ message: "Invalid format, missing fields to complete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
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

    if (
      title &&
      description &&
      price &&
      status &&
      thumbnails &&
      code &&
      stock &&
      category
    ) {
      const updateProduct = await productsClass.updateOne(pid, updatedProduct);

      return updateProduct
        ? res.json({ message: "successfully modified product" })
        : res
            .status(400)
            .json({ message: `The product with id ${pid} does not exist` });
    }

    res
      .status(400)
      .json({ message: "Invalid format, missing fields to complete" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deleteProduct = await productsClass.deleteOne(pid);

    if (deleteProduct) {
      return res.json({ message: "Product successfully removed" });
    }

    res
      .status(400)
      .json({ message: `The product with id ${pid} does not exist` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/allproducts", async (req, res) => {
  try {
    await productsClass.deleteMany();

    res.json({ message: "all products have been removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
