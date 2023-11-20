// const Razorpay = require("razorpay");
// const User = require("../models/user");
// const sequelize = require("../utils/database");
// const crypto = require("crypto");


const verifyPremiumMembership = async (req, res, next) => {
    console.log("Test");
    // const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    //     req.body;
    // if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Order not verified"
    //     });
    // }

    // const generatedSignature = crypto
    //     .createHmac("SHA256", process.env.RAZOR_PAY_SECRET)
    //     .update(razorpay_order_id + "|" + razorpay_payment_id)
    //     .digest("hex");

    // const isValid = generatedSignature == razorpay_signature;
    // if (isValid) {
    //     const updatedRows = await User.update(
    //         { isPremium: true },
    //         { where: { _id: req.user._id } }
    //     );
    //     if (updatedRows[0] === 1) {
    //         res.status(200).json({
    //             success: true,
    //             message: "Payment Successful!",
    //         });
    //     } else {
    //         res.status(400).json({
    //             success: false,
    //             message: "Payment Not Successful!",
    //         });

    //     }
    // } else {
    //     res.status(400).json({
    //         success: false,
    //         message: "Payment Not Successful!",
    //     });
    // }
}

module.exports = { verifyPremiumMembership };