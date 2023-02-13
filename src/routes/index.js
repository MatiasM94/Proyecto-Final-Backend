import products from "../controllers/controller.products.js";
import carts from "../controllers/controller.carts.js";

export const routes = (app) => {
  app.use("/api/products", products);
  app.use("/api/carts", carts);
};
