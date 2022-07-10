// Creates a new session with an attached notifier.
const Notifier = require("../controllers/notificationController")();
const Session = require("../models/sessionModel")(Notifier);

const router = (io, socket) => {
  // Logic for directing incoming connections to specific session instances will be
  // placed here.

  // Most incoming actions will be responded to with an updated version of the session state.
  socket.emit("updated-session", Session.getState());

  socket.on("join-session", async playerId => {
    await Session.addPlayer(playerId);
    socket.emit("notifications-key", Notifier.keys.publicKey);
    io.emit("updated-session", Session.getState());
  });

  socket.on("notifications-start", userKeys => {
    Notifier.subscribeUser(userKeys);
  });

  socket.on("game-create", ({ players, selectingPlr }) => {
    Session.createGame(players, selectingPlr);
    setTimeout(() => {
      io.emit("updated-session", Session.getState());
    }, 500);
  });

  socket.on("game-update", async ({ gameId, update }) => {
    await Session.updateGame(gameId, update);
    setTimeout(() => {
      io.emit("updated-session", Session.getState());
    }, 500);
  });

  socket.on("leave-session", playerId => {
    Session.removePlayer(playerId);
    Notifier.unsubscribeUser(playerId);
    io.emit("updated-session", Session.getState());
  });
};

module.exports = router;
