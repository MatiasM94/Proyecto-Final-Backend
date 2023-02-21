import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { handlebarsRoutes } from "./routes/handlebars.routes.js";
import { routes } from "./routes/index.js";
import { mongoPassword, port } from "./config/app/index.js";
import __dirname from "./utils.js";
import { connectionSocket } from "./socketio/socket.io.js";

const app = express();

// Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Routes
handlebarsRoutes(app);
routes(app);

// SocketIo
const httpServer = app.listen(port, () => {
  console.log(`running from express, PORT: ${port}`);
});

connectionSocket(httpServer);

// Mongoose
mongoose.set("strictQuery", false);
mongoose.connect(
  `mongodb+srv://admin:${mongoPassword}@proyectofinalcoder.anopmg1.mongodb.net/?retryWrites=true&w=majority`,
  (error) => {
    if (error) {
      console.log(
        `mongodb+srv://admin:*********@proyectofinalcoder.anopmg1.mongodb.net/?retryWrites=true&w=majority`
      );
      console.log("Connection error", error);
    } else {
      console.log("The connection to the database has been successful");
    }
  }
);
