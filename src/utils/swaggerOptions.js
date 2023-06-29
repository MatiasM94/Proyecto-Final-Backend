import __dirname from "./util.js";

export const swaggerOptions = {
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
