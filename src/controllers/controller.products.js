import { Router } from "express";
import FilesManager from "../dao/files.manager.js";
import Product from "../dao/models/products.models.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";

const productsClass = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  const productsInDb = await productsClass.find();

  const { limit } = req.query;
  const limitAmount = limit > 0 && limit < productsInDb.length;
  if (limitAmount) {
    productsInDb.splice(limit, productsInDb.length);

    return res.json(productsInDb);
  }

  res.json(productsInDb);
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const filteredProduct = await productsClass.findById(pid);

    if (filteredProduct) return res.send({ filteredProduct });

    res.send({ Error: `El producto con id ${pid} no existe` });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/allproducts", async (req, res) => {
  try {
    const productsFileManager = new FilesManager("Products.json");
    const products = await productsFileManager.loadItems();

    await Product.insertMany(products);

    res.status(201).json({ message: "productos agregados correctamente" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
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
      ? res.status(201).json({ message: "producto agregado" })
      : res.status(400).json({ message: "Producto Repetido" });
  }

  res
    .status(400)
    .json({ message: "Formato no válido, faltan campos por completar" });
});

router.put("/:pid", async (req, res) => {
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
    console.log(updateProduct);

    return updateProduct
      ? res.json({ message: "Producto modificado con exito" })
      : res
          .status(400)
          .json({ message: `El producto con id ${pid} no existe` });
  }

  res
    .status(400)
    .json({ message: "Formato no válido, faltan campos por completar" });
});

router.delete("/delete/:pid", async (req, res) => {
  const { pid } = req.params;
  const deleteProduct = await productsClass.deleteOne(pid);

  if (deleteProduct) {
    return res.json({ message: "Producto eliminado correctamente" });
  }

  res.status(400).json({ message: `El producto con el pid: ${pid} no existe` });
});

router.delete("/allproducts", async (req, res) => {
  await productsClass.deleteMany();

  res.json({ message: "Se eliminaron todos los productos" });
});

export default router;
