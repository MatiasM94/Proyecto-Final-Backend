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
import { mongoPassword, port } from "./config/app/index.js";
import __dirname from "./utils/util.js";
import { connectionSocket } from "./socketio/socket.io.js";
import initializePassport from "./config/passport.jwt.config.js";
import errorHandler from "./middlewares/errors/handler.errors.js";
import addLogger from "./middlewares/logger.middleware.js";

const app = express();
app.use(addLogger);
app.use(cors({ origin: ["http://localhost:8000"] }));

// Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: `mongodb://admin:${mongoPassword}@localhost:27017/proyectoFinalCoder`,
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

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación del ecommerce",
      description:
        "Aquí encontraras toda la informacion necesaria para trabajar con la API",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const httpServer = app.listen(port, () => {
  console.log(`running from express, PORT: ${port}`);
});

// SocketIo
connectionSocket(httpServer);
