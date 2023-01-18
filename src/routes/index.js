import products from "../products/controller.products.js"
import carts from "../carts/controller.carts.js"

export const routes = (app) => {
    app.use('/api/products', products)
    app.use('/api/carts', carts)
};