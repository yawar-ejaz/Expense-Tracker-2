const Razorpay = require("razorpay");
const User = require("../models/users");
const Orders = require("../models/orders");
const Expenses = require("../models/expenses");
const Downloads = require("../models/downloads");
const sequelize = require("../utils/database");
const { Op } = require("sequelize");
const crypto = require("crypto");
const { Parser } = require("json2csv");
const uploadToS3 = require("../utils/upload");

const verifyPremiumMembership = async (req, res, next) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
        req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Order not verified"
        });
    }

    const generatedSignature = crypto
        .createHmac("SHA256", process.env.RAZOR_PAY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

    const isValid = generatedSignature == razorpay_signature;
    if (isValid) {
        try {
            const t = await sequelize.transaction();
            const updatedRows = await User.update(
                { isPremium: true },
                {
                    where: { _id: req.user._id },
                    transaction: t
                }
            );
            await Orders.update(
                { status: "completed", paymentId: razorpay_payment_id },
                {
                    where: { orderId: razorpay_order_id },
                    transaction: t
                }
            );
            t.commit();
            if (updatedRows[0] === 1) {
                res.status(200).json({
                    success: true,
                    message: "Payment Successful!",
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Payment Not Successful!",
                });

            }
        } catch (error) {
            t.rollback();
            console.log(error);
        }
    } else {
        res.status(400).json({
            success: false,
            message: "Payment Not Successful!",
        });
    }
}

const getLeaderboard = async (req, res, next) => {
    const result = await User.findAll({
        attributes: ['name', 'isPremium', 'totalExpense'],
        order: [["totalExpense", "DESC"]]
    });
    res.status(200).json(result)
}

const getReport = async (req, res, next) => {
    const type = req.query.type;
    const user = req.user;

    if (type != "monthly" && type != "yearly") {
        res.status(400).json({
            success: false,
            message: "Invalid type specified"
        });
    }

    const currentDate = new Date();
    const startDate = new Date(currentDate);
    
    if (type == "monthly") {
        startDate.setMonth(currentDate.getMonth() - 1);
    }
    else if (type == "yearly") {
        startDate.setFullYear(currentDate.getFullYear() - 1);
    }
    try {
        const expenses = await Expenses.findAll({
            attributes: ["createdAt", "description", "category", "amount"],
            where: {
                userId: user._id,
                createdAt: {
                    [Op.gte]: startDate,
                },
            },
            order: [["createdAt", "DESC"]],
        });

        if (expenses.length == 0) {
            return res.status(200).json({
                url: "",
                success: false,
            });
        }

        //generate csv
        const data = [];
        expenses.forEach((element) => {
            const { createdAt, description, category, amount } = element;
            data.push({ createdAt, category, description, amount });
        });
        const fileName = `Expensify-${user._id}/${new Date()}.csv`;
        const csvFields = ["createdAt", "category", "description", " amount"];
        const csvParser = new Parser(csvFields);
        const csv = csvParser.parse(data);
        const fileUrl = await uploadToS3(csv, fileName);

        //save to database
        await Downloads.create({ url: fileUrl });

        return res.status(200).json({
            url: fileUrl,
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "could not fetch monthly expenses"
        });
    }
}

module.exports = { verifyPremiumMembership, getLeaderboard, getReport };