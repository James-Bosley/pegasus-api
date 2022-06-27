const bcrypt = require("bcrypt");

let users = [
  {
    email: "james_bosley@hotmail.co.uk",
    first_name: "james",
    last_name: "bosley",
    auth_method: "local",
    display_name: "James Bosley",
    joined: 1656171746032,
    last_visit: 1656171762823,
    gender: "m",
    handedness: "l",
  },
  {
    email: "jason_fernandes@hotmail.co.uk",
    first_name: "jason",
    last_name: "fernandes",
    auth_method: "local",
    display_name: "Ferno",
    joined: 1656171832098,
    last_visit: 1656171845293,
    gender: "m",
    handedness: "r",
  },
  {
    email: "jon_pontin@hotmail.co.uk",
    first_name: "jonathan",
    last_name: "pontin",
    auth_method: "local",
    display_name: "Pontin",
    joined: 1656171884774,
    last_visit: 1656171894306,
    gender: "m",
    handedness: "r",
  },
  {
    email: "james_vallerine@hotmail.co.uk",
    first_name: "james",
    last_name: "vallerine",
    auth_method: "local",
    display_name: "Christian Vallerine",
    joined: 1656171746032,
    last_visit: 1656171944694,
    gender: "m",
    handedness: "r",
  },
  {
    email: "paul_blayney@hotmail.co.uk",
    first_name: "paul",
    last_name: "blayney",
    auth_method: "local",
    display_name: "Paul Blayney",
    joined: 1656171988521,
    last_visit: 1656171999596,
    gender: "m",
    handedness: "r",
  },
];

// Adding placeholding passwords to each test user.
users = users.map(user => {
  const password = bcrypt.hashSync("test", 8);
  return { ...user, password };
});

const visits = [
  {
    user_id: 1,
    start_time: 1656173597286,
    end_time: 1656173697286,
  },
  {
    user_id: 2,
    start_time: 1656173598986,
    end_time: 1656173697286,
  },
];

const games = [
  {
    time_created: 1656172185740,
    user_id_selected_by: 1,
    time_started: 1656172213644,
    time_completed: 1656172214646,
    user_id_win_1: 1,
    user_id_win_2: 2,
    user_id_lose_1: 4,
    user_id_lose_2: 5,
    win_score: 21,
    lose_score: 19,
  },
  {
    time_created: 1656172342101,
    user_id_selected_by: 2,
    time_started: 1656172342101,
    time_completed: 1656172343126,
    user_id_win_1: 5,
    user_id_win_2: 4,
    user_id_lose_1: 3,
    user_id_lose_2: 2,
    win_score: 21,
    lose_score: 12,
  },
  {
    time_created: 1656172367221,
    user_id_selected_by: 1,
    time_started: 1656172367879,
    time_completed: 165617237152,
    user_id_win_1: 5,
    user_id_win_2: 1,
    user_id_lose_1: 4,
    user_id_lose_2: 3,
    win_score: 21,
    lose_score: 20,
  },
  {
    time_created: 1656172424269,
    user_id_selected_by: 4,
    time_started: 1656172425169,
    time_completed: 165617243218,
    user_id_win_1: 4,
    user_id_win_2: 2,
    user_id_lose_1: 1,
    user_id_lose_2: 3,
    win_score: 21,
    lose_score: 17,
  },
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("games").del();
  await knex("visits").del();
  await knex("users").del();

  await knex("users").insert(users);
  await knex("visits").insert(visits);
  await knex("games").insert(games);
};
