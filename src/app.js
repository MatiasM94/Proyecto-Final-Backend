import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { handlebarsRoutes } from "./routes/handlebars.routes.js";
import { routes } from "./routes/index.js";
import { port, mongodb } from "./config/app/index.js";
import __dirname from "./utils/util.js";
import { connectionSocket } from "./socketio/socket.io.js";
import initializePassport from "./config/passport.jwt.config.js";
import addLogger from "./middlewares/logger.middleware.js";
import { swaggerOptions } from "./utils/swaggerOptions.js";

const app = express();
app.use(addLogger);
app.use(
  cors({
    origin: [
      "http://localhost:8000",
      "https://ecommerce-matias.vercel.app",
      "https://ecommerce-matiasm94.vercel.app",
    ],
    credentials: true,
    métodos: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);

// Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongodb.mongoConnect,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: mongodb.secretMongoKey,
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

const specs = swaggerJsdoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const httpServer = app.listen(port, () => {
  console.log(`running from express, PORT: ${port}`);
});

// SocketIo
connectionSocket(httpServer);
