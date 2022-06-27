require("dotenv").config({ path: "../.env" });

// Configures a knex query builder instance based on environment and
// creates a bookshelf ORM instance using knex as a connector.
const dbEnvironment = process.env.NODE_ENV || "development";
const configs = require("./knexfile")[dbEnvironment];

const knex = require("knex")(configs);
const bookshelf = require("bookshelf")(knex);

module.exports = bookshelf;
