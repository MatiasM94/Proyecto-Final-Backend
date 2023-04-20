import Product from "../models/products.models.js";

class ProductManager {
  async find(props, rest) {
    const products = await Product.paginate(rest, props);
    return products;
  }

  async findById(pid) {
    const product = await Product.findById(pid);
    return product;
  }

  async create(newProduct) {
    return await Product.create(newProduct);
  }

  async updateOne(pid, updatedProduct) {
    const updateProduct = await Product.updateOne(pid, updatedProduct);
    return updateProduct;
  }

  async deleteOne(pid) {
    const deleteProduct = await Product.deleteOne(pid);
    return deleteProduct;
  }

  async deleteMany() {
    await Product.deleteMany();
  }
}

export default ProductManager;
