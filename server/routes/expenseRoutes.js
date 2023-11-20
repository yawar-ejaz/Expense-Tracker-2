const express = require("express")
const router = express.Router();
const { createExpense } = require("../controllers/expenseController");
const auth = require("../middlewares/auth");

router.route("/").post(auth, createExpense);// the request will travel to the middleware first and then to createExpense

module.exports = router;