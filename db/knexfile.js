/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

// Allows commands such as migrations and seedings to be run in this directory,
// without running the server.
require("dotenv").config({ path: "../.env" });

const sharedConfig = {
  client: "mysql",
  migrations: { directory: "./migrations" },
  seeds: { directory: "./seeds" },
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: {
      host: "127.0.0.1",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DATABASE,
      charset: "utf8",
    },
  },

  // Database URL is provided by default in a Heroku deployment.
  production: {
    ...sharedConfig,
    connection: process.env.JAWSDB_URL,
    pool: {
      min: 2,
      max: 10,
    },
  },
};
