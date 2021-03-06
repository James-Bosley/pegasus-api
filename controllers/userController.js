const Users = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userReport = require("./reportController");

// Variables likely to change during production.
const SALT_ROUNDS = process.env.SALT_RNDS || 8;
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

const addUser = async (req, res) => {
  try {
    // Declares all required fields. Their presence is checked in the request body, and this
    // array also forms the template for the new user object.
    const requiredFields = [
      "email",
      "first_name",
      "last_name",
      "auth_method",
      "password",
      "display_name",
    ];

    const missingFields = [...requiredFields].reduce((prev, currentField) => {
      return req.body[currentField] != null ? prev : [...prev, currentField];
    }, []);

    if (missingFields.length) {
      return res
        .status(400)
        .json({ error: true, message: "Missing fields: " + missingFields.join(", ") });
    }

    const existingUser = await Users.getByEmail(req.body.email);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "User exists with email " + req.body.email });
    }

    const newUser = {};
    requiredFields.forEach(field => {
      newUser[field] = req.body[field];
    });
    newUser.joined = Date.now();
    newUser.last_visit = Date.now();

    if (req.body.gender) newUser.gender = req.body.gender;
    if (req.body.handedness) newUser.handedness = req.body.handedness;

    // Creates hashed password, safe to store in DB.
    newUser.password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

    await Users.add(newUser);

    return res.status(201).json({ error: false, message: "", data: { success: true } });
    //
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: true, message: "Server failed to add user" });
  }
};

const logInLocal = (req, res) => {
  try {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Token is returned in response.
    return res.status(200).json({ error: false, message: "", data: { token } });
    //
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: true, message: "Server error. Please try again" });
  }
};

const logInOAuth = (req, res) => {
  try {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Redirection is aimed at main application feature - the games page. The token is appended as a
    // query string for storage and use on the client side.
    return res.redirect(`${SITE_URL}/games/pick?token=${token}`);
    //
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: true, message: "Server error. Please try again" });
  }
};

const logOutUser = (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: true, message: "Server error. Please try again" });
    }
    return res.status(200).json({ error: false, message: "", data: { success: true } });
  });
};

const getProfile = (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: true, message: "Please sign in" });
    }

    // Acts as template for the returned fields. The whole user should not be returned to avoid
    // revealing protected fields such as the hashed password.
    const fieldsToReturn = [
      "id",
      "first_name",
      "last_name",
      "display_name",
      "joined",
      "gender",
      "handedness",
    ];

    const user = {};
    fieldsToReturn.forEach(field => (user[field] = req.user[field]));

    return res.status(201).json({ error: false, message: "", data: { user } });
    //
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: true, message: "Server error. Please try again" });
  }
};

const editUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: true, message: "Please sign in" });
    }

    // If incorrect fields have been supplied an error will be thrown.
    await Users.update(req.user.id, req.body);

    return res.status(200).json({ error: false, message: "", data: { success: true } });
    //
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: true, message: "Server failed to update user" });
  }
};

const editPassword = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: true, message: "Please sign in" });
    }

    if (req.user.auth_method !== "local") {
      return res.status(400).json({
        error: true,
        message:
          "You do not use a password to sign in. Please contact your authentication provider.",
      });
    }

    const passwordCheck = bcrypt.compareSync(req.body.password, req.user.password);

    if (!passwordCheck) {
      return res.status(400).json({ error: true, message: "Incorrect Password" });
    }

    const newPassword = bcrypt.hashSync(req.body.newPassword, SALT_ROUNDS);
    await Users.update(req.user.id, { password: newPassword });

    return res.status(200).json({ error: false, message: "", data: { success: true } });
    //
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: true, message: "Server failed to update password" });
  }
};

const getReport = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: true, message: "Please sign in" });
    }

    const report = await userReport(req.user.id);

    return res.status(200).download(report);
    //
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: true, message: "Server failed create report" });
  }
};

module.exports = {
  addUser,
  logInLocal,
  logInOAuth,
  logOutUser,
  getProfile,
  editUser,
  editPassword,
  getReport,
};
