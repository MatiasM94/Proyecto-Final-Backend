import express from "express";
import __dirname from "../utils.js";
import handlebar from '../handlebars/controller.handlebars.js'

export const handlebarsRoutes = (app) => {

    app.set('views', __dirname + '/views')

    app.set('view engine', 'handlebars')

    app.use(express.static(__dirname + '/public'), handlebar)
}