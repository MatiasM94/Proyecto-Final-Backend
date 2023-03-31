import ProductRouter from "./product.router.js";
import UserRouter from "./user.router.js";

const usersRouter = new UserRouter();
const productsRouter = new ProductRouter();
export const routers = (app) => {
  app.use("/api/users", usersRouter.getRouter());
  app.use("/api/products", productsRouter.getRouter());
};
