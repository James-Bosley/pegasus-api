const Games = require("../models/gameModel");

const GamesMethods = {
  async addOne(game) {
    const newGame = await new Games(game).save({}, { method: "insert" });
    return newGame.toJSON();
  },

  async getAllByUser(userId) {
    const games = await new Games()
      .query(qb => {
        qb.where("user_id_win_1", userId)
          .orWhere("user_id_win_2", userId)
          .orWhere("user_id_lose_1", userId)
          .orWhere("user_id_lose_2", userId);
      })
      .orderBy("time_completed", "DESC")
      .fetchAll({ require: false });
    if (!games) {
      return null;
    } else {
      return games.toJSON();
    }
  },
};

module.exports = GamesMethods;
