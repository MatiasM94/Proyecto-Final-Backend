import { Router } from "express";
import ProductManager from "../dao/managerFileSystem/productManager.js";
import { emitAddProduct, emitDeleteProduct } from "../socketio/socket.io.js";

const productsClass = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const productsInJson = await productsClass.getProducts();
    console.log(productsInJson);
    const { limit } = req.query;

    const limitAmount = limit > 0 && limit < productsInJson.length;
    if (limitAmount) {
      productsInJson.splice(limit, productsInJson.length);

      return res.render("home", {
        productsInJson,
        style: "home.css",
      });
    }
    res.render("home", {
      productsInJson,
      style: "home.css",
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts", { style: "home.css" });
});

router.post("/realtimeproducts", async (req, res) => {
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

  try {
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
      const addNewProduct = await productsClass.addProduct(newProduct);
      return addNewProduct && emitAddProduct(addNewProduct)
        ? res.status(201).json({ message: "Producto agregado con exito!" })
        : res.status(400).json({ message: "Producto Repetido" });
    }

    res.status(400).json({
      message: "Formato no válido, faltan campos por completar",
    });
  } catch (error) {
    console.log(error.message);
  }
});

router.delete("/realtimeproducts/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deleteProduct = await productsClass.deleteProduct(pid);

    if (deleteProduct) {
      emitDeleteProduct(deleteProduct);
      return res.json({ message: "Producto eliminado correctamente" });
    }
    res
      .status(400)
      .json({ message: `El producto con el pid: ${pid} no existe` });
  } catch (error) {
    console.log(error.message);
  }
});

export default router;
