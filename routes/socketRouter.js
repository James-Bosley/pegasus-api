const Session = require("../models/sessionModel")();

const router = (io, socket) => {
  // Logic for directing incoming connections to specific session instances will be
  // placed here.

  socket.emit("updated-session", Session.getState());

  socket.on("join-session", async playerId => {
    await Session.addPlayer(playerId);
    io.emit("updated-session", Session.getState());
  });

  socket.on("game-create", ({ players, selectingPlr }) => {
    Session.createGame(players, selectingPlr);
    io.emit("updated-session", Session.getState());
  });

  socket.on("game-update", async ({ gameId, update }) => {
    await Session.updateGame(gameId, update);
    io.emit("updated-session", Session.getState());
  });

  socket.on("leave-session", playerId => {
    Session.removePlayer(playerId);
    io.emit("updated-session", Session.getState());
  });

  socket.on("disconnect", () => {});
};

module.exports = router;
