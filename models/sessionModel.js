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
    this.selected_by = selectingPlr;
    this.time_created = Date.now();
    this.session = session;
    this.players = players;
    return [this.id, this];
  }

  start() {
    if (!this.time_started) {
      this.time_started = Date.now();
    }
  }

  end() {
    this.time_completed = Date.now();
  }

  async recordResult({ win_score, lose_score, winningPlayers, losingPlayers }) {
    if (!this.time_completed) this.end();

    const gameEntry = {
      time_created: this.time_created,
      user_id_selected_by: this.selected_by.id,
      time_started: this.time_started,
      time_completed: this.time_completed,
      win_score,
      lose_score,
    };
    winningPlayers.forEach((plr, i) => (gameEntry["user_id_win_" + (i + 1)] = plr));
    losingPlayers.forEach((plr, i) => (gameEntry["user_id_lose_" + (i + 1)] = plr));

    try {
      await new Games(gameEntry).save({}, { method: "insert" });

      await winningPlayers.forEach(async plr => await this.session.addPlayer(plr));
      await losingPlayers.forEach(async plr => await this.session.addPlayer(plr));
      return;
      //
    } catch (err) {
      console.error(err.message);
    }
  }

  getState() {
    return {
      id: this.id,
      players: this.players,
      selected_by: this.selected_by,
    };
  }
}

class Session {
  constructor(numberOfCourts) {
    this.id = uuid();
    this.courts = numberOfCourts || 3;
    this.queue = [];
    this.gamesOn = [];
    this.gamesWait = [];
  }

  async addPlayer(playerId) {
    const user = await Users.getDisplayAttrs(playerId);
    this.queue.push({ id: playerId, ...user });
  }

  removePlayer(playerId) {
    this.queue = this.queue.filter(plr => plr.id !== playerId);
  }

  async createGame(players, selectingPlr) {
    const selector = await Users.getDisplayAttrs(selectingPlr);
    const gamePlayers = this.queue.filter(plr => players.includes(plr.id));

    const [id, game] = new Game(gamePlayers, selector, this);

    players.forEach(plrId => {
      this.queue = this.queue.filter(queuedPlr => queuedPlr.id !== plrId);
    });
    this.gamesWait.push({ id: id, actions: game });
    this.gameStatusCheck();
  }

  gameStatusCheck() {
    if (this.gamesOn.length < this.courts) {
      const nextGame = this.gamesWait.shift();

      if (nextGame) {
        nextGame.actions.start();
        this.gamesOn.push(nextGame);
      }
    }
  }

  async updateGame(gameId, update) {
    const updatingGame = this.gamesOn.find(game => game.id === gameId);

    if (update.type === "record-result") {
      await updatingGame.actions.recordResult(update.payload);
      this.removeGame(updatingGame.id);
      this.gameStatusCheck();
      return;
    }
  }

  removeGame(gameId) {
    this.games = this.gamesOn.filter(game => game.id !== gameId);
  }

  getState() {
    return {
      queue: this.queue,
      games: {
        on: this.gamesOn.map(game => game.actions.getState()),
        wait: this.gamesWait.map(game => game.actions.getState()),
      },
    };
  }
}

module.exports = () => new Session();
