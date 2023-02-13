import express from "express";
import __dirname from "../utils.js";
import chat from "../handlebars/chat.handlebar.js";
import realTimeProducts from "../handlebars/controller.handlebars.js";

export const handlebarsRoutes = (app) => {
  app.set("views", __dirname + "/views");

  app.set("view engine", "handlebars");

  app.use(express.static(__dirname + "/public"), realTimeProducts);
  app.use(express.static(__dirname + "/public"), chat);
};
