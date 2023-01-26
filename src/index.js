import express from "express";
import handlebars from "express-handlebars";
import { handlebarsRoutes } from "./routes/handlebars.routes.js";
import { routes } from "./routes/index.js";
import { connectionSocket } from "./routes/utils/socket.io.js";
import { port } from "./config/app/index.js";

const app = express();

const httpServer = app.listen(port, () => {
  console.log(`running from express, PORT: ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());

handlebarsRoutes(app);
routes(app);

connectionSocket(httpServer);
