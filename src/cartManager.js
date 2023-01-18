import fs from "fs";

export default class CartManager {
    constructor() {
        this.path = '../carts.json'
        this.carts = [];
    }

    getCarts = async () => {
        try {
            const cartsInJson = await fs.promises.readFile(this.path, 'utf-8');
            if (cartsInJson) {
                const carts = JSON.parse(cartsInJson);
                return carts
            }
            
            return this.carts

        } catch (error) {
            console.log(error.message)
        }
    }

    addCart = async () => {
        try {
            const cartsInJson = await this.getCarts();

            const id = cartsInJson ? cartsInJson.length + 1 : this.carts.length + 1;

            cartsInJson.push({id, products: []})

            await fs.promises.writeFile(this.path, JSON.stringify(cartsInJson));

        } catch (error) {
            console.log(message.error)
        }
        
    }

    addProductInCart = async (product) => {
        try {
            const {cid, pid} = product;
            const getCarts = await this.getCarts();

            const cart = await this.getCartById(cid);
            const { cartPositionInArray } = cart;

            const filteredProduct = await this.getProductById(cid, pid);
            const {productInCart, productPositionInArray} = filteredProduct;

            if(cartPositionInArray === -1) return false
            
            if (productInCart) {
                const updatedProduct = {
                    pid, 
                    quantity: productInCart.quantity + 1,
                }

                getCarts[cartPositionInArray].products[productPositionInArray]= {...updatedProduct};
                await fs.promises.writeFile(this.path, JSON.stringify(getCarts));
                
                return true
            }

            const productAdd = {
                pid,
                quantity: 1,
            }
            getCarts[cartPositionInArray].products = [...getCarts[cartPositionInArray].products, productAdd];

            await fs.promises.writeFile(this.path, JSON.stringify(getCarts));

            return true

        } catch (error) {
            console.log(error.message)
        }
        
    }
    getCartById = async (cid) => {
        try {
            const cartsInJson = await this.getCarts();

            if(cartsInJson.length > 0) {
                const findCart = cartsInJson.find((cart) => +cart.id === +cid)
                const cartPositionInArray = cartsInJson.findIndex(cart => +cart.id === +cid)
                
                return {findCart, cartPositionInArray};
            }
            return false
        } catch (error) {
            console.log(error.message)
        }
        
    }

    getProductById = async (cid, pid) => {
        try {
            const cartInJson = await this.getCartById(cid);
            const { findCart } = cartInJson;

            if(findCart) {
                const productInCart = findCart.products.find((cart) =>+cart.pid === +pid);
                const productPositionInArray = findCart.products.findIndex(product => +product.pid === +pid);

                return {productInCart, productPositionInArray};
            }
            return false
        } catch (error) {
            console.log(error.message)
        }
    }
}