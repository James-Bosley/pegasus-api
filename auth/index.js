const passport = require("passport");
const Users = require("../models/userModel");

// The different strategies available to users are added to the passport
// instance here. They are invoked by using the relevent string in passport.authenticate().
const LocalStrategy = require("../auth/localStrategy");
passport.use(LocalStrategy);

const GoogleStrategy = require("../auth/googleStrategy");
passport.use(GoogleStrategy);

// Logic for serializing a user into the session storage and subsequently retrieving
// their data on subsequent http requests.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await Users.getById(userId);
  done(null, user);
});

// Exposes all of the auth strategies to the application.
module.exports = passport;
