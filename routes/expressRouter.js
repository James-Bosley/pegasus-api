const router = require("express").Router();
const passport = require("../auth");
const userCtrl = require("../controllers/userController");

// Auth routes are configured here.
router.post("/signup/local", userCtrl.addUser);
router.post(
  "/login/local",
  passport.authenticate("local", { failureMessage: true }),
  userCtrl.logInLocal
);

router.get("/signup/google", passport.authenticate("google"));
router.get("/login/google", passport.authenticate("google"));
router.get(
  "/login/google/redirect",
  passport.authenticate("google", { failureMessage: true }),
  userCtrl.logInOAuth
);
//

// Route ends a current session and removes the req.user object.
router.get("/logout", userCtrl.logOutUser);

// Protected routes to get or update a logged in users profile.
router.get("/profile", userCtrl.getProfile);
router.get("/report", userCtrl.getReport);
router.put("/profile", userCtrl.editUser);
router.put("/password", userCtrl.editPassword);

module.exports = router;
