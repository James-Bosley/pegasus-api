const bookshelf = require("../db/configs");
const uuid = require("crypto").randomUUID;
const Users = require("../models/userModel");

// Establishes a Games model connected to the underlying table and sets relations to other tables.
const Games = bookshelf.model("Games", {
  tableName: "games",
  users() {
    return this.hasOne("Users");
  },
});

class Game {
  constructor(players, selectingPlr, session) {
    this.id = uuid();
    this.user_id_selected_by = selectingPlr;
    this.time_created = Date.now();
    this.session = session;
    this.players = players;
    return [this.id, this];
  }

  start() {
    this.time_started = Date.now();
  }

  end() {
    this.time_completed = Date.now();
  }

  async recordResult({ win_score, lose_score, winningPlayers, losingPlayers }) {
    if (!this.time_completed) this.end();

    const gameEntry = {
      time_created: this.time_created,
      user_id_selected_by: this.user_id_selected_by,
      time_started: this.time_started,
      time_completed: this.time_completed,
      win_score,
      lose_score,
    };
    winningPlayers.forEach((plr, i) => (gameEntry["user_id_win_" + (i + 1)] = plr));
    losingPlayers.forEach((plr, i) => (gameEntry["user_id_lose_" + (i + 1)] = plr));

    try {
      await new Games(gameEntry).save({}, { method: "insert" });
      this.resultEntered = true;
    } catch (err) {
      console.error(err.message);
    }

    if (this.resultEntered) {
      winningPlayers.forEach(plr => this.session.addPlayer(plr));
      losingPlayers.forEach(plr => this.session.addPlayer(plr));
      this.session.removeGame(this.id);
    }
  }

  getState() {
    return {
      id: this.id,
      players: this.players,
      selected_by: this.user_id_selected_by,
    };
  }
}

class Session {
  constructor() {
    this.id = uuid();
    this.queue = [];
    this.games = [];
  }

  async addPlayer(playerId) {
    const user = await Users.getDisplayAttrs(playerId);
    this.queue.push({ id: playerId, ...user });
  }

  removePlayer(playerId) {
    this.queue = this.queue.filter(plr => plr.id !== playerId);
  }

  createGame(players, selectingPlr) {
    const gamePlayers = this.queue.filter(plr => players.includes(plr.id));

    const [id, game] = new Game(gamePlayers, selectingPlr, this);

    players.forEach(plrId => {
      this.queue = this.queue.filter(queuedPlr => queuedPlr.id !== plrId);
    });
    this.games.push({ id: id, actions: game });
  }

  async updateGame(gameId, update) {
    const updatingGame = this.games.find(game => game.id === gameId);

    if (update.type === "start") {
      updatingGame.actions.start();
      return;
    }

    if (update.type === "record-result") {
      await updatingGame.actions.recordResult(update.payload);
    }
  }

  removeGame(gameId) {
    this.games = this.games.filter(game => game.id !== gameId);
  }

  getState() {
    return {
      queue: this.queue,
      games: this.games.map(game => game.actions.getState()),
    };
  }
}

module.exports = () => new Session();
