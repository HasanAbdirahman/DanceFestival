const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users");

router.post("/register", userCtrl.registerUser);
router.post("/login", userCtrl.login);
router.get("/logout", userCtrl.logout);

router.post("/forgotPassword", userCtrl.forgotPassword);
router.post("/resetPassword/:token", userCtrl.resetPassword);

module.exports = router;
