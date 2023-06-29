import auth from "../controllers/auth.controller.js";
import users from "../controllers/user.controller.js";
import products from "../controllers/product.controller.js";
import carts from "../controllers/cart.controller.js";
import mail from "../controllers/mail.controller.js";

export const routes = (app) => {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/products", products);
  app.use("/api/carts", carts);
  app.use("/api/mail", mail);
};
