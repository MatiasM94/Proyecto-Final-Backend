import products from "../controllers/controller.products.js";
import carts from "../controllers/controller.carts.js";
import users from "../controllers/user.controllers.js";
import auth from "../controllers/auth.controllers.js";

export const routes = (app) => {
  app.use("/api/products", products);
  app.use("/api/carts", carts);
  app.use("/users", users);
  app.use("/auth", auth);
};
