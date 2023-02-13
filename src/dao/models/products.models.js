import mongoose from "mongoose";

const productCollection = "product";

const productSchema = mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  status: Boolean,
  thumbnails: [{ image: String, imgPortada: String, image2: String }],
  stock: Number,
  code: String,
  category: String,
});

const Product = mongoose.model(productCollection, productSchema);

export default Product;
