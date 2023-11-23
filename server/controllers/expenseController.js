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

const getExpenses = async(req, res, next) => {
    console.log("expenses here")
    const result = await Expenses.findAll({
        attributes: ['_id', 'amount', 'date', 'category', 'description'],
        order: [["date", "DESC"]],
        where: { userId: req.user._id }
    });
    res.status(201).json(result);
}

const deleteExpense = async(req, res, next) => {
    try {
        const expenseId = req.params.expenseId;
        if (!expenseId) {
            return res.status(400).json({
                success: false,
                message: "Expense does not exist"
            });
        }
        const expense = await Expenses.findOne({
            where: { _id: expenseId }
        });
        await Expenses.destroy({
            where: {
                _id: expenseId
            }
        });
        await User.update(
            { totalExpense: Number(req.user.totalExpense) - Number(expense.amount) },
            { where: { _id: req.user._id } }
        );
        
        res.status(200).json({
            success: true,
            message: "Expense Deleted"
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { createExpense, getExpenses, deleteExpense }; 