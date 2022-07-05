require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const http = require("http");
const logger = require("morgan");

// Instantiates app and creates both an express server and a socket.io server/
const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: true, credentials: true },
});

// Allows the nginx from heroku buildpack to access server.
app.set("trust proxy", 1);

// Express middlewares to enable sustained sessions, access to request bodies,
// and logging that is dependant on operating environment.
app.use(logger(process.env.NODE_ENV === "production" ? "common" : "dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    credentials: true,
    saveUninitialized: false,
  })
);
app.use(express.json());

// Connects passport authenitication middleware.
const passport = require("./auth");
app.use(passport.initialize());
app.use(passport.session());

// All express routes are handled through a router at /v1.
const expressRouter = require("./routes/expressRouter");
app.use("/v1", expressRouter);

// Socket authentication using JWT.
const authStrategy = require("./auth/socketAuth");
io.use(authStrategy);

// All socket connections are managed by a router that is passed the socket.io
// instance and the connected socket as arguments.
const socketRouter = require("./routes/socketRouter.js");
const socketConnect = socket => socketRouter(io, socket);
io.on("connection", socketConnect);

// The http server is listening, not the express server. This is because the socket.io
// connection and the express server both need to listen to the same port.
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
