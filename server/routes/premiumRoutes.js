const express = require("express")
const router = express.Router();

const { verifyPremiumMembership } = require('../controllers/premiumController');

router.route("/verify").post(verifyPremiumMembership);

module.exports = router;