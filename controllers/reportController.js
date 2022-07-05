const reportGenerator = require("../util/reportGenerator");
const Users = require("../models/userModel");
const Games = require("../repositories/gamesRepository");

const gameTime = time => {
  const addZero = num => (num < 10 ? "0" + num : num);
  const date = new Date(time);
  const hours = addZero(date.getHours());
  const minutes = addZero(date.getMinutes());
  return date.toLocaleDateString() + " at " + hours + ":" + minutes;
};

const gameDesciptionString = async (game, userId) => {
  let string = "";
  const isWinner = game.user_id_win_1 === userId || game.user_id_win_2 === userId;

  if (isWinner) {
    string += "Won";
  } else {
    string += "Lost";
  }

  if (isWinner) {
    if (game.user_id_win_1 === userId && game.user_id_win_2) {
      const partner = await Users.getById(game.user_id_win_2);
      string += " with " + partner.display_name;
      //
    } else if (game.user_id_win_2) {
      const partner = await Users.getById(game.user_id_win_1);
      string += " with " + partner.display_name;
    }

    string += " against ";

    const oppo1 = await Users.getById(game.user_id_lose_1);
    string += oppo1.display_name;
    if (game.user_id_lose_2) {
      const oppo2 = await Users.getById(game.user_id_lose_2);
      string += " and " + oppo2.display_name;
    }
    //
  } else {
    if (game.user_id_lose_1 === userId && game.user_id_lose_2) {
      const partner = await Users.getById(game.user_id_lose_2);
      string += " with " + partner.display_name;
      //
    } else if (game.user_id_lose_2) {
      const partner = await Users.getById(game.user_id_lose_1);
      string += " with " + partner.display_name;
    }

    string += " against ";

    const oppo1 = await Users.getById(game.user_id_win_1);
    string += oppo1.display_name;
    if (game.user_id_win_2) {
      const oppo2 = await Users.getById(game.user_id_win_2);
      string += " and " + oppo2.display_name;
    }
  }

  string += " by " + game.win_score + " to " + game.lose_score;
  return string + ".";
};

const userReport = async userId => {
  const user = await Users.getById(userId);
  const games = await Games.getAllByUser(userId);
  const reports = await Promise.all(
    games.map(async (game, i) => {
      return {
        name: gameTime(game.time_completed),
        value: await gameDesciptionString(game, userId),
      };
    })
  );

  const wins = games.filter(game => game.user_id_win_1 === userId || game.user_id_win_2 === userId);

  const report = await reportGenerator({
    reportName: `Individual Player Report - ${user.first_name} ${user.last_name}`,
    reportId: user.id,
    sections: [
      {
        title: "Player Profile",
        items: [
          { name: "GoChamp player ID", value: user.id },
          { name: "Display name", value: user.display_name },
        ],
      },
      {
        title: "Game Statistics",
        items: [
          {
            name: "Number of Games Played",
            value: games.length,
          },
          {
            name: "Total Wins",
            value: wins.length,
          },
        ],
      },
      {
        title: "Game Records",
        items: reports,
      },
    ],
  });
  return report;
};

module.exports = userReport;
