import express from "express";
import ProductManager from "./productManager.js";

const productsClass = new ProductManager();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
    try {
        const { limit } = req.query;
        const productsInJson = await productsClass.getProducts();

        if (limit > 0 && limit < productsInJson.length) {
            const productsLimit = productsInJson.map(producto => producto)
            productsLimit.splice(limit, productsInJson.length)

            return res.send({ productsLimit })
        }
        res.send({ productsInJson });
    } catch (error) {
        console.log(error.message);
    }
    
})
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productsInJson = await productsClass.getProducts();

        const filteredProduct = productsInJson.find(producto => +producto.id === +id)

        if (filteredProduct) return res.send({ filteredProduct });

        res.send({Error: `El producto con id ${id} no existe`})

    } catch (error) {
        console.log(error.message)
    }
})

app.listen(3000, () => {
    console.log("running from express")
});