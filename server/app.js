require("dotenv").config();
require("./config/database").connect();
const cors = require("cors");
const fileUpload = require("express-fileupload");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const indexRouter = require("./route/index");

const app = express();
const server = http.createServer(app);

//creating a new socket server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.io = io;

app.use(express.json());
app.use(fileUpload());

app.use(
  cors({
    origin: ["http://localhost:3000"], //change origin based on domain main of the application
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

//Defining headers for cors
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//using routes
app.use("/", indexRouter);

// Socket.IO integration
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = { app, server };
