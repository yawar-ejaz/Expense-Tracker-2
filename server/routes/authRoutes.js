const express = require("express")
const router = express.Router();
const { createUser, login } = require('../controllers/authController');

router.route("/sign-up").post(createUser)
router.route("/sign-in").post(login)

module.exports = router;