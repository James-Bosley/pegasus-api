const jwt = require("jsonwebtoken");

const strategy = (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        socket.emit("auth-error");
        return next(new Error("Authentication error"));
      }
      socket.decoded = decoded;
      next();
    });
  } else {
    socket.emit("auth-error");
    next(new Error("Authentication error"));
  }
};

module.exports = strategy;
