const router = require("express").Router();
const passport = require("../auth");
const {
  addUser,
  logInUser,
  logOutUser,
  getProfile,
  editUser,
} = require("../controllers/userController");

// Auth routes are configured here.
router.post("/signup/local", addUser);
router.post("/login/local", passport.authenticate("local", { failureMessage: true }), logInUser);

router.get("/signup/google", passport.authenticate("google"));
router.get("/login/google", passport.authenticate("google"));
router.get(
  "/login/google/redirect",
  passport.authenticate("google", { failureMessage: true }),
  logInUser
);
//

// Route ends a current session and removes the req.user object.
router.post("/logout", logOutUser);

// Protected routes to get or update a logged in users profile.
router.get("/profile", getProfile);
router.put("/profile", editUser);

module.exports = router;
