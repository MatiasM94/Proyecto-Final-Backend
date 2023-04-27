import express from "express";
import session from "express-session";
import passport from "passport";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { handlebarsRoutes } from "./routes/handlebars.routes.js";
import { routes } from "./routes/index.js";
import { mongoPassword, port } from "./config/app/index.js";
import __dirname from "./util.js";
import { connectionSocket } from "./socketio/socket.io.js";
import initializePassport from "./config/passport.jwt.config.js";
import errorHandler from "./middlewares/errors/handler.errors.js";

const app = express();

// Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://admin:${mongoPassword}@proyectofinalcoder.anopmg1.mongodb.net/?retryWrites=true&w=majority`,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: "askjdi32423kmdsd",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
// Passport
initializePassport();
app.use(passport.initialize());

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Routes
routes(app);
handlebarsRoutes(app);
app.use(errorHandler);

const httpServer = app.listen(port, () => {
  console.log(`running from express, PORT: ${port}`);
});

// SocketIo
connectionSocket(httpServer);
