const Expenses = require("../models/expenses");
const User = require("../models/users");
const sequelize = require("../utils/database");

const createExpense = async (req, res, next) => {
    const { amount, category, description } = req.body;
    const date = new Date();

    try {
        const t = await sequelize.transaction();
        await Expenses.create(
            {
                amount,
                description,
                category,
                date,
                userId: req.user._id
            },
            {
                transaction: t,
            }
        );
        await User.update(
            { totalExpense: Number(req.user.totalExpense) + Number(amount) },
            {
                where: { _id: req.user._id },
                transaction: t
            }
        );
        await t.commit();

        res.status(201).json({
            success: true,
            message: "Expense added successfully"
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: "Failed to add expense to the database!"
        });
        console.log("failed to add expense to the database. " + error);
    }
}

const getExpenses = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.rows) || 10;
    const startIndex = (page - 1) * itemsPerPage;

    const result = await Expenses.findAndCountAll({
        attributes: ['_id', 'amount', 'date', 'category', 'description'],
        order: [["date", "DESC"]],
        where: { userId: req.user._id },
        offset: startIndex,
        limit: itemsPerPage
    });
    const { count, rows } = result;
    const totalPages = Math.ceil(count / itemsPerPage);
    res.status(200).json({
        expenses: rows,
        currentPage: page,
        totalPages: totalPages,
    });
}

const deleteExpense = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();
        const expenseId = req.params.expenseId;
        if (!expenseId) {
            return res.status(404).json({
                success: false,
                message: "Expense does not exist"
            });
        }
        const expense = await Expenses.findOne(
            {
                where: { _id: expenseId },
                transaction: t
            }
        );
        await Expenses.destroy(
            {
                where: { _id: expenseId },
                transaction: t
            }
        );
        await User.update(
            { totalExpense: Number(req.user.totalExpense) - Number(expense.amount) },
            {
                where: { _id: req.user._id },
                transaction: t
            }
        );
        await t.commit();

        res.status(200).json({
            success: true,
            message: "Expense deleted"
        });
    } catch (error) {
        await t.rollback();
        res.status(400).json({
            success: false,
            message: "Unable to delete expense"
        });
    }
}

module.exports = { createExpense, getExpenses, deleteExpense }; 