import Product from "../models/products.models.js";

class ProductManager {
  async find(limit = 5, page = 1, sort = "", rest = {}) {
    const products = await Product.paginate(rest, {
      page,
      limit,
      sort: { price: `${sort}` },
    });
    return products;
  }

  async findById(pid) {
    const product = await Product.findById(pid).exec();
    return product;
  }

  async create(newProduct) {
    await Product.create(newProduct);
    return true;
  }

  async updateOne(pid, updatedProduct) {
    const updateProduct = await Product.updateOne({ _id: pid }, updatedProduct);
    const productsUpdateCounter = updateProduct.modifiedCount;
    return productsUpdateCounter;
  }

  async deleteOne(pid) {
    await Product.deleteOne({ _id: pid });
    return true;
  }

  async deleteMany() {
    await Product.deleteMany();
  }
}

export default ProductManager;
