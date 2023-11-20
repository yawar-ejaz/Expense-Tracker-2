const Razorpay = require('razorpay');
const Orders = require('../models/orders');

const purchasePremium = async (req, res, next) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZOR_PAY_KEY,
            key_secret: process.env.RAZOR_PAY_SECRET
        });

        instance.orders.create({ amount: 5000, currency: 'INR' }, (err, order) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to create order!"
                });
            }
            Orders.create({
                orderId: order.id,
                status: "pending",
                userId: req.user._id
            });
            res.status(201).json(order);
        });
    } catch (error) {
        console.log("Razorpay Error " + error);
    }
}

module.exports = { purchasePremium };