import { Router } from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../productManager.js";

const cartClass = new CartManager();

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartsInJson = await cartClass.getCartById(cid)
        const { findCart} = cartsInJson;

        if (findCart) return res.send({ findCart });

        res.send({Error: `El producto con id ${cid} no existe`})

    } catch (error) {
        console.log(error.message)
    }
})

router.post('/', async (req, res) => {
    try {
        await cartClass.addCart();
        
        res.status(201).json({message: 'Carrito  creado con exito'})
        
    } catch (error) {
        console.log(error.message)
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const productClass = new ProductManager();
        const product = req.params
        const productInJson = await productClass.getProductById(product.pid)

        if(productInJson === false) return res.status(400).json({message: `El producto con id ${product.pid} no existe`})
        return (
            await cartClass.addProductInCart(product) ?
                res.json({message: 'producto agregado con exito'}) :
                res.status(400).json({message: `El cart con id ${product.cid} no existe`})
        )
    } catch (error) {
        console.log(error.message)
    }
    
})

export default router;