import { Router } from "express";
import CartManager from "../dao/managerMongo/cart.managerMongo.js";
import ProductManager from "../dao/managerMongo/product.managerMongo.js";
import FilesManager from "../dao/files.manager.js";
import Cart from "../dao/models/carts.models.js";

const cartClass = new CartManager();

const router = Router();

router.get("/", async (req, res) => {
  const cartsInMongo = await cartClass.find();
  res.json({ message: `Los carritos encontrados son: ${cartsInMongo}` });
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cartsInMongo = await cartClass.findById(cid);

    if (cartsInMongo) return res.send({ cartsInMongo });

    res.send({ Error: `El producto con id ${cid} no existe` });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/allcarts", async (req, res) => {
  try {
    const cartsFileManager = new FilesManager("carts.json");
    const carts = await cartsFileManager.loadItems();

    await Cart.insertMany(carts);

    res.status(201).json({ message: "carts agregados" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const productClass = new ProductManager();
  const productInMongo = await productClass.findById(pid);

  if (!productInMongo) {
    return res
      .status(400)
      .json({ message: `El producto con id ${pid} no existe` });
  }

  const cart = await cartClass.findById(cid);
  if (cart)
    return res
      .status(400)
      .json({ message: `El cart con id ${cid} ya existe!` });

  const newCart = { products: [{ pid, quantity: 1 }] };
  await cartClass.create(newCart);
  res.json({ message: "Se agrego un nuevo cart con un producto dentro" });
  return;
});

router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const productClass = new ProductManager();
  const productInMongo = await productClass.findById(pid);

  if (!productInMongo) {
    return res
      .status(400)
      .json({ message: `El producto con id ${pid} no existe` });
  }

  const cart = await cartClass.findById(cid);
  if (!cart) return res.json({ message: `El cart con id ${cid} no existe!` });

  const { products } = cart;

  const indexPosition = products.findIndex((product) => product.pid === pid);

  if (indexPosition !== -1) {
    products[indexPosition].quantity += 1;

    await cartClass.updateOne(cid, cart);
    res.json({
      message: `Se aumento la quantity en 1 del producto con id ${pid}`,
    });
    return;
  }

  products.push({ pid, quantity: 1 });
  await cartClass.updateOne(cid, cart);
  res.json({ message: "Se agrego un nuevo producto" });
});

export default router;
