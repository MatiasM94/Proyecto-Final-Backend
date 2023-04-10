import Product from "../dao/models/products.models.js";

const findPersistProducts = async (params, rest = {}) => {
  const products = await Product.paginate(rest, params);
  return products;
};

const findByIdPersistProduct = async (pid) => {
  const product = await Product.findById(pid);
  return product;
};

const createPersistProduct = async (newProduct) => {
  const createProduct = await Product.create(newProduct);
  return createProduct;
};

const updateOnePersistProduct = async (pid, updatedProduct) => {
  const updateProduct = await Product.updateOne(pid, updatedProduct);
  return updateProduct;
};

const deleteOnePersistProduct = async (pid) => {
  const deleteProduct = await Product.deleteOne(pid);
  return deleteProduct;
};

export {
  findPersistProducts,
  findByIdPersistProduct,
  createPersistProduct,
  updateOnePersistProduct,
  deleteOnePersistProduct,
};
