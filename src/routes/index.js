import auth from "../controllers/auth.controllers.js";
import users from "../controllers/user.controllers.js";
import products from "../controllers/controller.products.js";
import carts from "../controllers/controller.carts.js";

export const routes = (app) => {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/products", products);
  app.use("/api/carts", carts);
};
