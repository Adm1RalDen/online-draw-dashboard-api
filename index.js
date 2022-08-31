require("dotenv").config();

const express = require("express");
const DataBase = require("./db/index");
const router = require("./routes/index");
const FileUploader = require("express-fileupload");
const cookieParser = require("cookie-parser");
const ErrorHandler = require("./middlewares/errorHandler.middleware");
const { SetCors } = require("./utils/cors");
const { setSockets } = require("./sockets");
const { Server } = require("socket.io");
const { PORT, STATIC_FOLDER } = require("./const/settings");
const { API } = require("./const/endpoints");
const { CONNECTION } = require("./const/sockets");

const app = express();
app.use(cookieParser());
app.use(SetCors());
app.use(express.static(STATIC_FOLDER));
app.use(express.json());
app.use(FileUploader({}));
app.use(API, router);
app.use(ErrorHandler);

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

io.on(CONNECTION, (socket) => setSockets(socket, io));

server.listen(PORT, async () => {
  try {
    await DataBase();
    console.log(`server is working on ${PORT} port`);
  } catch (e) {
    console.error(e.message);
  }
});
