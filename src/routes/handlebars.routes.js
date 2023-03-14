import express from "express";
import __dirname from "../util.js";
import chat from "../handlebars/chat.handlebar.js";
import realTimeProducts from "../handlebars/controller.handlebars.js";
import products from "../handlebars/products.handlebar.js";
import carts from "../handlebars/carts.handlebars.js";
import sessions from "../handlebars/sessions.handlebars.js";

export const handlebarsRoutes = (app) => {
  app.use(express.static(__dirname + "/public"), realTimeProducts);
  app.use(express.static(__dirname + "/public"), chat);
  app.use(express.static(__dirname + "/public"), products);
  app.use(express.static(__dirname + "/public"), carts);
  app.use(express.static(__dirname + "/public"), sessions);
};
