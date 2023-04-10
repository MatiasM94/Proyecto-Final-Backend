import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productCollection = "product";

const productSchema = mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  status: Boolean,
  thumbnails: String,
  stock: Number,
  code: {
    type: String,
    unique: true,
  },
  category: String,
});

productSchema.plugin(paginate);

const Product = mongoose.model(productCollection, productSchema);

export default Product;
