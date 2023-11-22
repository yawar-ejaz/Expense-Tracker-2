const Expenses = require("../models/expenses");
const User = require("../models/users");


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
        await User.update(
            { totalExpense: Number(req.user.totalExpense) + Number(amount) },
            { where: { _id: req.user._id } }
        );

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