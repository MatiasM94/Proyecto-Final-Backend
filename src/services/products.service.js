import {
  createPersistProduct,
  deleteOnePersistProduct,
  findByIdPersistProduct,
  findPersistProducts,
  updateOnePersistProduct,
} from "../persists/product.persist.js";

const findProducts = async (limit = 5, page = 1, sort = "", rest) => {
  const props = { limit, page, sort };
  try {
    const productsInDb = await findPersistProducts(props, rest);

    if (productsInDb.docs.length > 0) {
      return { status: "Sucess", payload: productsInDb };
    }
    return { error: `peticion include an incorrect parm`, rest };
  } catch (error) {
    console.log(error);
  }
};

const findById = async (pid) => {
  const product = await findByIdPersistProduct(pid);

  if (product) return { product };

  return { error: `The product with id ${pid} does not exist` };
};

const createProduct = async (newProductInfo) => {
  const {
    title,
    description,
    price,
    status,
    thumbnails,
    code,
    stock,
    category,
  } = newProductInfo;
  if (
    title &&
    description &&
    price &&
    status &&
    thumbnails &&
    code &&
    stock &&
    category
  ) {
    const newProduct = await createPersistProduct(newProductInfo);

    return { message: "Added product", newProduct };
  }

  return { error: "Invalid format, missing fields to complete" };
};

const updateOne = async (pid, updatedProduct) => {
  const {
    title,
    description,
    price,
    status,
    thumbnails,
    code,
    stock,
    category,
  } = updatedProduct;

  if (
    !title ||
    !description ||
    !price ||
    !status ||
    !thumbnails ||
    !code ||
    !stock ||
    !category
  )
    return { error: "Invalid format, missing fields to complete" };

  const updateProduct = await updateOnePersistProduct(
    { _id: pid },
    updatedProduct
  );
  const productsUpdateCounter = updateProduct.matchedCount;
  if (productsUpdateCounter === 0)
    return {
      productsUpdateCounter,
      error: `The product with id ${pid} does not exist`,
    };

  return { productsUpdateCounter, message: "successfully modified product" };
};

const deleteOne = async (pid) => {
  const deleteProduct = await deleteOnePersistProduct({ _id: pid });

  const deletedCount = deleteProduct.deletedCount;
  if (deletedCount)
    return { deletedCount, message: "Product successfully removed" };

  return { deletedCount, error: `The product with id ${pid} does not exist` };
};

export { findProducts, findById, createProduct, updateOne, deleteOne };
