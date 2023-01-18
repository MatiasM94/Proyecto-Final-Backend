// import { Router } from "express";
// import ProductManager from "../productManager.js";

// const productsClass = new ProductManager();

// export const router = Router();

// router.get("/", async (req, res) => {
//     try {
//         const { limit } = req.query;
//         const productsInJson = await productsClass.getProducts();

//         if (limit > 0 && limit < productsInJson.length) {
//             const productsLimit = productsInJson.map((producto) => producto);
//             productsLimit.splice(limit, productsInJson.length);

//             return res.send({ productsLimit });
//         }
//         res.send({ productsInJson });
//     } catch (error) {
//         console.log(error.message);
//     }
// });
