import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { adminId } from "../../config/app/index.js";

const productCollection = "product";
const productSchema = mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  status: Boolean,
  thumbnails: [{ image2: String }],
  stock: Number,
  code: {
    type: String,
    unique: true,
  },
  category: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: adminId,
  },
});

productSchema.plugin(paginate);

const Product = mongoose.model(productCollection, productSchema);

export default Product;
