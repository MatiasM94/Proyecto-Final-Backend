import { Router } from "express";
import ProductManager from "../productManager.js";

const productsClass = new ProductManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const productsInJson = await productsClass.getProducts();
        
        const { limit } = req.query;
        const limitAmount = limit > 0 && limit < productsInJson.length
        if (limitAmount) {
            productsInJson.splice(limit, productsInJson.length);

            return res.json(productsInJson);
        }

        res.json(productsInJson);

    } catch (error) {
        console.log(error.message);
    }
});

router.get('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            
            const filteredProduct = await productsClass.getProductById(pid);
    
            if (filteredProduct) return res.send({ filteredProduct });

            res.send({Error: `El producto con id ${pid} no existe`})
    
        } catch (error) {
            console.log(error.message)
        }
    })

router.post('/', async (req, res) => {
    try {
        const {title, description, price, status, thumbnails, code, stock, category} = req.body;
        const newProduct = {
            title,
            description,
            price,
            status,
            thumbnails,
            code,
            stock,
            category
        };
        if(title && description && price && status && thumbnails && code && stock && category) {
            return (
                await productsClass.addProduct(newProduct) ?
                    res.status(201).json({message: 'producto agregado'}) :
                    res.status(400).json({message: 'Producto Repetido'}));
        }

        res.status(400).json({message: 'Formato no válido, faltan campos por completar'})
    } catch (error) {
        console.log(error.message)
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const {title, description, price, status, thumbnails, code, stock, category} = req.body;
        const updatedProduct = {
            title,
            description,
            price,
            status,
            thumbnails,
            code,
            stock,
            category
        };

        if (title && description && price && status && thumbnails && code && stock && category) {
            const updateProduct = await productsClass.updateProduct(pid, updatedProduct);

            return (
                updateProduct ? 
                    res.json({message: 'Producto modificado con exito'}) :
                    res.status(400).json({message: `El producto con id ${pid} no existe`})
            )
        }

        res.status(400).json({message: 'Formato no válido, faltan campos por completar'})

    } catch (error) {
        console.log(error.message)
    }
    
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deleteProduct = await productsClass.deleteProduct(pid);

        if (deleteProduct) return res.json({message: 'Producto eliminado correctamente'});

        res.status(400).json({message: `El producto con el pid: ${pid} no existe`})

    } catch (error) {
        console.log(error.message)
    }
})

export default router;