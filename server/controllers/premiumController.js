const Razorpay = require("razorpay");
const User = require("../models/users");
const orders = require("../models/orders")
const sequelize = require("../utils/database");
const crypto = require("crypto");
const Orders = require("../models/orders");

const verifyPremiumMembership = async (req, res, next) => {
    console.log("Test");
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

module.exports = { verifyPremiumMembership, getLeaderboard };