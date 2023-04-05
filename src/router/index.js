import UserRouter from "./user.router.js";

const usersRouter = new UserRouter();

export const routers = (app) => {
  app.use("/api/users", usersRouter.getRouter());
};
