class ProductDTO {
  constructor(product) {
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.status = product.status;
    this.thumbnails = product.thumbnails;
    this.code = product.code;
    this.stock = product.stock;
    this.category = product.category;
  }
}

export default ProductDTO;
