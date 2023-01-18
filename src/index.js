import express from "express";
import { port } from "./config/app/index.js";
import { routes } from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static(__dirname + '/public'))

routes(app)

app.listen(port, () => {
    console.log(`running from express, PORT: ${port}`)
});