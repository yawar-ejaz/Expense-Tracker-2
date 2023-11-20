const express = require("express")
const router = express.Router();
const auth = require("../middlewares/auth");


const { verifyPremiumMembership } = require('../controllers/premiumController');

router.route("/verify").post(auth, verifyPremiumMembership);

module.exports = router;