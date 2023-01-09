import fs from "fs";

export default class ProductManager {
    constructor() {
        this.path = "../products.json";
        this.products = [];
    }
    getProducts = async () => {
        try {
            let productosData;

            const data = await fs.promises.readFile(this.path, "utf-8");
            data ? (productosData = JSON.parse(data)) : null;

            return data ? productosData : this.products;
        } catch (error) {
            console.log(error.message);
        }
    };
    addProduct = async ({
        title,
        description,
        price,
        thumbnail,
        stock,
        code,
    }) => {
        try {
            let productoRepetido;
            const productos = await this.getProducts();
            productos.length === 0
                ? (productoRepetido = false)
                : (productoRepetido = productos.some((producto) =>producto.title === title || producto.code === code));

            if (productoRepetido) {
                console.log("Producto repetido");
            } else {
                const id = productos ? productos.length + 1 : this.products.length + 1;
                productos.push({
                    id,
                    title,
                    description,
                    price,
                    thumbnail,
                    stock,
                    code,
                });
                await fs.promises.writeFile(this.path, JSON.stringify(productos));
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    getProductById = async (id) => {
        try{
            let productId;
            const data = await this.getProducts();
            data.length === 0 ? console.log("no hay productos") :
            productId = data.find((producto) => producto.id === id);

            return (productId
                ? console.log(`se encontro el producto: ${productId.title}`)
                : console.log("no se encontraron coincidencias"));
        }catch(error) {
            console.log(error.message)
        }
        
    };
    updateProduct = async (id, title) => {
        try {
            let modificarProducto
            const productos = await this.getProducts();
            productos === 0 ? null :
            modificarProducto = productos.find(product => product.id === id );
            modificarProducto.title = title;
            await fs.promises.writeFile(this.path, JSON.stringify(productos) )
        } catch (error) {
            console.log(error.message)
        }
    }
    deleteProduct = async (id) => {
        try {
            const productos = await this.getProducts();

            const eliminarProducto = productos.find(product => product.id === id );
            if (eliminarProducto === undefined) return console.log("El id que quiere eliminar, no existe");
            const indice = productos.indexOf(eliminarProducto);
            productos.splice(indice, 1);

            await fs.promises.writeFile(this.path, JSON.stringify(productos))
        } catch (error) {
            console.log(error.message)
        }
    }
}

// const producto = new ProductManager();

// const newProduct = {
//     title: "producto prueba",
//     description: "Este es un producto de prueba",
//     price: 200,
//     thumbnail: "sin imagen",
//     code: "abc123",
//     stock: 25,
// };
// const newProduct2 = {
//     title: "producto prueba2",
//     description: "Este es un producto de prueba",
//     price: 200,
//     thumbnail: "sin imagen",
//     code: "abc1234",
//     stock: 25,
// };
// const newProduct3 = {
//     title: "producto prueba3",
//     description: "Este es un producto de prueba",
//     price: 200,
//     thumbnail: "sin imagen",
//     code: "abc1232",
//     stock: 25,
// };

// await producto.addProduct(newProduct);
// await producto.addProduct(newProduct2);
// await producto.addProduct(newProduct3);
// await producto.addProduct(newProduct);


// await producto.getProductById(1)

// console.log(await producto.getProducts());

// await producto.updateProduct(2, "lo modifique");

// await producto.deleteProduct(1)

// console.log(await producto.getProducts());
