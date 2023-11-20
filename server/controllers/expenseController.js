const Expenses = require("../models/expenses");


const createExpense = async (req, res, next) => {
    const { amount, category, description } = req.body;
    const date = new Date();

    try {
        await Expenses.create({
            amount,
            description,
            category,
            date,
            userId: req.user._id
        });
        res.status(201).json({
            success: true,
            message: "Expense added successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add expense to the database!"
        });
        console.log("failed to add expense to the database. " + error);
    }
}

module.exports = { createExpense }; 