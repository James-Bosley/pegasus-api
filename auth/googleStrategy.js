const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Users = require("../models/userModel");

// Variable likely to change during production.
const BASE_URL = process.env.SITE_URL || "http://localhost:8080";

const stratgey = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${BASE_URL}/v1/login/google/redirect`,
    scope: ["email", "profile"],
    state: true,
  },
  async (accessToken, _refreshToken, profile, done) => {
    const user = await Users.getByEmail(profile.emails[0].value);

    // Creates a new user if they do not already have an account.
    if (!user) {
      const newUser = {
        email: profile.emails[0].value,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        display_name: profile.displayName,
        joined: Date.now(),
        last_visit: Date.now(),
        auth_method: "google",
        password: accessToken,
      };

      const addedUser = await Users.add(newUser);

      return done(null, addedUser);
    }

    return done(null, user);
  }
);

module.exports = stratgey;
