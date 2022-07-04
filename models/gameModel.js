const bookshelf = require("../db/configs");

// Establishes a Games model connected to the underlying table and sets relations to other tables.
const Games = bookshelf.model("Games", {
  tableName: "games",
  users() {
    return this.belongsTo("Users");
  },
});

module.exports = Games;
