import app from "./index.js";
import { port } from "./config/app/index.js";
import { connectionSocket } from "./socketio/socket.io.js";

const httpServer = app.listen(port, () => {
  console.log(`running from express, PORT: ${port}`);
});

connectionSocket(httpServer);
