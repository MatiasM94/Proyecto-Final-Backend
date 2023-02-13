import Product from "../models/products.models.js";

class ProductManager {
  async find() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async findById(pid) {
    try {
      const product = await Product.findById(pid).exec();

      return product;
    } catch (error) {
      console.log(error);
    }
  }

  async create(newProduct) {
    try {
      await Product.create(newProduct);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOne(pid, updatedProduct) {
    try {
      const updateProduct = await Product.updateOne(
        { _id: pid },
        updatedProduct
      );
      const productsUpdateCounter = updateProduct.modifiedCount;
      return productsUpdateCounter;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteOne(pid) {
    try {
      await Product.deleteOne({ _id: pid });
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteMany() {
    try {
      await Product.deleteMany();
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProductManager;
