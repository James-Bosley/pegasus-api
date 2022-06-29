const uuid = require("crypto").randomUUID;

class Game {
  constructor(players, selectingPlr, session) {
    this.id = uuid();
    this.selected_by_user_id = selectingPlr;
    this.time_created = Date.now()
    this.session = session;
    this.players = players;
  }

  start() {
    this.time_started = Date.now(); 
  }



  getState() {
    return {
      id: this.id,
      players: this.players
    };
  }
}

class Session {
  constructor() {
    this.id = uuid();
    this.queue = [];
    this.games = [];
  }

  addPlayer(playerId) {
    this.queue.push(playerId);
  }

  createGame(players, selectingPlr) {
    const game = new Game(players, selectingPlr, this);
    players.forEach(plrId => {
      this.queue.filter(queuedPlrId => queuedPlrId !== plrId);
    });
    this.games.push(game);
  }

  removeGame(gameId) {
    this.games.
  }

  getState() {
    return {
      queue: this.queue,
      games: this.games.map(game => game.getState()),
    };
  }
}
