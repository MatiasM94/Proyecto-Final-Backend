class ProductManager {
    constructor() {
        this.products = [];
    }
    getProducts = () => {
        return this.products
    }
    addProduct = ({title, description, price, thumbnail, stock, code}) => {

        const productoRepetido = this.products.some((producto) => producto.title === title || producto.code === code )
        
        if (productoRepetido) {
            console.log("Producto repetido")
        }else {
            const id = this.products.length + 1;
            this.products.push({id, title, description, price, thumbnail, stock, code})
        }
    }

    getProductById = (id) => {
        
        const productId = this.products.find((producto) => producto.id === id)

        productId ? console.log(`se encontro el producto: ${productId.title}`) : console.log("no se encontraron coincidencias")
    }
}

const producto = new ProductManager;

const newProduct = {
    title: "producto prueba",
    description: "Este es un producto de prueba",
    price: 200,
    thumbnail: "sin imagen",
    code: "abc123",
    stock: 25
}
const newProduct2 = {
    title: "producto prueba2",
    description: "Este es un producto de prueba",
    price: 200,
    thumbnail: "sin imagen",
    code: "abc1234",
    stock: 25
}
const newProduct3 = {
    title: "producto prueba",
    description: "Este es un producto de prueba",
    price: 200,
    thumbnail: "sin imagen",
    code: "abc123",
    stock: 25
}

producto.addProduct(newProduct);
producto.addProduct(newProduct2);
producto.addProduct(newProduct3);

console.log(producto.getProductById(2))

console.log(producto.getProducts());