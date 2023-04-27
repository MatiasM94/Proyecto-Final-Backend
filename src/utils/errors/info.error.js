export const generateProductErrorInfo = (product) => {
  return `
  One or More Properties were incomplete or not valid.
  List of required properties:
  title: needs to be String, received: ${product.title},
  description: needs to be String, received: ${product.description},
  price: needs to be Number, received: ${product.price},
  status: needs to be Boolean, received: ${product.status},
  thumbnails: need to be Array of Objects, received: ${product.thumbnails},
  code: needs to be String, received: ${product.code},
  stock: needs to be Number, received: ${product.stock},
  category: needs to be String, received: ${product.category}
  `;
};
