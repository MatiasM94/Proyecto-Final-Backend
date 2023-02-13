import fs from "fs";

export default class ProductManager {
  constructor() {
    this.path = "./files/Products.json";
    this.products = [];
  }
  getProducts = async () => {
    try {
      const productsInJson = await fs.promises.readFile(this.path, "utf-8");
      if (productsInJson) {
        const products = JSON.parse(productsInJson);

        return products;
      }
      return this.products;
    } catch (error) {
      console.log(error.message);
    }
  };
  addProduct = async (newProduct) => {
    try {
      const products = await this.getProducts();

      const repeatedProduct = products.some(
        (product) =>
          product.title === newProduct.title || product.code === newProduct.code
      );
      if (repeatedProduct) return !repeatedProduct;

      const id = products ? products.length + 1 : this.products.length + 1;
      const newProductToAdd = { id, ...newProduct };
      products.push(newProductToAdd);
      await fs.promises.writeFile(this.path, JSON.stringify(products));

      return newProductToAdd;
    } catch (error) {
      console.log(error.message);
    }
  };

  getProductById = async (pid) => {
    try {
      const products = await this.getProducts();

      if (products.length > 0) {
        const findProduct = products.find((product) => +product.id === +pid);

        return findProduct ? findProduct : false;
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  updateProduct = async (pid, updatedProducto) => {
    try {
      const products = await this.getProducts();
      const productToUpdate = await this.getProductById(pid);

      const positionInArray = products.findIndex(
        (product) => +product.id === +pid
      );

      if (productToUpdate) {
        products[positionInArray] = { ...productToUpdate, ...updatedProducto };

        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return true;
      }
      console.log("producto no encontrado");
      return false;
    } catch (error) {
      console.log(error.message);
    }
  };
  deleteProduct = async (pid) => {
    try {
      const products = await this.getProducts();
      const productToDelete = await this.getProductById(pid);

      if (productToDelete) {
        const positionInArray = products.findIndex(
          (product) => +product.id === +pid
        );
        products.splice(positionInArray, 1);

        await fs.promises.writeFile(this.path, JSON.stringify(products));

        return productToDelete;
      }
      console.log(`Producto con pid ${pid} no encontrado`);
      return false;
    } catch (error) {
      console.log(error.message);
    }
  };
}
