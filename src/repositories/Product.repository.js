import ProductDTO from "../DTOs/Product.dto.js";
import CustomError from "../utils/errors/Custom.error.js";
import EnumError from "../utils/errors/enum.error.js";
import { generateProductErrorInfo } from "../utils/errors/info.error.js";

class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async find(limit = 10, page = 1, sort = "", rest) {
    const props = { limit, page, sort };
    try {
      const productsInDb = await this.dao.find(props, rest);
      if (productsInDb.docs.length > 0) {
        return { status: "Sucess", payload: productsInDb };
      }
      return { error: `peticion include an incorrect parm`, rest };
    } catch (error) {
      req.logger.fatal(error);
      return { error };
    }
  }

  async findById(pid) {
    try {
      const product = await this.dao.findById(pid);
      if (product) return product;

      return { error: `The product with id ${pid} does not exist` };
    } catch (error) {
      return { error };
    }
  }

  async create(product, isPremium) {
    try {
      const newProductInfo = new ProductDTO(product);
      const { role, _id } = isPremium;
      const user = "premium";
      if (role === user) newProductInfo.owner = _id;
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
        const newProduct = await this.dao.create(newProductInfo);

        if (newProduct.code === 11000) throw new Error({ code: 11000 });
        return { message: "Added product", newProduct };
      }
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo({
          title,
          description,
          price,
          status,
          thumbnails,
          code,
          stock,
          category,
        }),
        message: "Error trying to create an product",
        code: EnumError.INVALID_TYPES_ERROR,
      });
    } catch (error) {
      if (error.code === 11000) return { error: "El producto ya existe" };
      return error;
    }
  }

  async updateOne(pid, updatedProductInfo) {
    const updatedProduct = new ProductDTO(updatedProductInfo);
    const {
      title,
      description,
      price,
      status,
      thumbnails,
      code,
      stock,
      category,
    } = updatedProductInfo;
    if (
      !title ||
      !description ||
      !price ||
      !status ||
      !thumbnails ||
      !code ||
      (!stock && stock != 0) ||
      !category
    )
      return { error: "Invalid format, missing fields to complete" };

    const updateProduct = await this.dao.updateOne(
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
  }

  async deleteOne(pid, userInfo) {
    const { _id, role } = userInfo;
    const isPremium = "premium";

    const product = await this.findById(pid);
    if (product.error) return product;

    const productOwner = product.owner._id.toString();
    if ((isPremium === role && productOwner === _id) || role === "admin") {
      const deleteProduct = await this.dao.deleteOne({ _id: pid });
      return { message: "Product successfully removed" };
    }
    return { error: "No tienes permisos para eliminar este producto" };
  }
}

export default ProductRepository;
