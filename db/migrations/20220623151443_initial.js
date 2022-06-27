/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema
    .createTable("users", t => {
      t.increments("id").notNullable();
      t.string("email").unique().notNullable();
      t.string("first_name").notNullable();
      t.string("last_name").notNullable();
      t.string("auth_method").notNullable();
      t.string("password");
      t.string("display_name").notNullable();
      t.bigint("joined").unsigned().notNullable();
      t.bigint("last_visit").unsigned().notNullable();
      t.string("gender", 1);
      t.string("handedness", 1);
    })
    .createTable("visits", t => {
      t.increments("id").notNullable();
      t.integer("user_id").unsigned().notNullable();
      t.bigint("start_time").unsigned().notNullable();
      t.bigint("end_time").unsigned();
      t.foreign("user_id").references("users.id");
    })
    .createTable("games", t => {
      t.increments("id").notNullable();
      t.bigint("time_created").unsigned().notNullable();
      t.integer("user_id_selected_by").unsigned().notNullable();
      t.bigint("time_started").unsigned().notNullable();
      t.bigint("time_completed").unsigned().notNullable();
      t.integer("user_id_win_1").unsigned().notNullable();
      t.integer("user_id_win_2").unsigned();
      t.integer("user_id_lose_1").unsigned().notNullable();
      t.integer("user_id_lose_2").unsigned();
      t.integer("win_score").unsigned().notNullable();
      t.integer("lose_score").unsigned().notNullable();
      t.foreign("user_id_selected_by").references("users.id");
      t.foreign("user_id_win_1").references("users.id");
      t.foreign("user_id_win_2").references("users.id");
      t.foreign("user_id_lose_1").references("users.id");
      t.foreign("user_id_lose_2").references("users.id");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("games")
    .dropTableIfExists("visits")
    .dropTableIfExists("users");
};
