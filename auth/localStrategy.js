const LocalStrategy = require("passport-local").Strategy;
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

const strategy = new LocalStrategy(async (username, password, done) => {
  const user = await Users.getByEmail(username);

  if (!user) {
    return done(null, false);
  }

  // Checks provided password against hashed password in DB.
  const matchedPassword = bcrypt.compareSync(password, user.password);
  if (!matchedPassword) {
    return done(null, false);
  }

  return done(null, user);
});

module.exports = strategy;
