import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { handlebarsRoutes } from "./routes/handlebars.routes.js";
import { routes } from "./routes/index.js";
import { mongoPassword } from "./config/app/index.js";

const app = express();

mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://admin:${mongoPassword}@proyectofinalcoder.anopmg1.mongodb.net/?retryWrites=true&w=majority`,
  (error) => {
    if (error) {
      console.log(error);
    }
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());

handlebarsRoutes(app);
routes(app);

export default app;
