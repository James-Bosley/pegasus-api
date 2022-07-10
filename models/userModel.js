const bookshelf = require("../db/configs");

// Establishes a Users model connected to the underlying table and sets relations to other tables.
const Users = bookshelf.model("Users", {
  tableName: "users",
  visits() {
    return this.hasMany("Visits");
  },
  games() {
    return this.hasMany("Games");
  },
});

// Establishes a Visits model connected to the underlying table and sets relations to other tables.
// This will be used in the future to log user visits to the site.
const Visits = bookshelf.model("Visits", {
  tableName: "visits",
  user() {
    return this.hasOne("Users");
  },
});

module.exports = Users;
