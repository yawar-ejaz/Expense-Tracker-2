const Users = require("../models/users");
const ForgotPasswordRequests = require("../models/forgotPasswordRequests");
const { encrypt, isMatching } = require("../utils/hashing");
const createToken = require("../utils/createToken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await Users.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email id already exists"
            })
        }

        const user = await Users.create({
            name,
            email,
            password: await encrypt(password)
        });
        const token = createToken(user._id)
        res.status(201).json({
            success: true,
            token,
            name: user.name,
            email: user.email,
            message: "Account created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add user to the database!"
        });
        console.log("failed to add user to the database. " + error);
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await Users.findOne({
            where: {
                email: email
            }
        });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "user not exists!"
            });
        }
        if (await isMatching(password, existingUser.password)) {
            const token = createToken(existingUser._id)
            return res.status(200).json({
                success: true,
                token,
                name: existingUser.name,
                email: existingUser.email,
                message: "User Logged In!"
            });
        }
        res.status(401).json({
            success: false,
            message: "incorrect password"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
}

const sendResetLink = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "email is required!"
        });
    }

    try {
        const user = await Users.findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user found with this email id"
            });
        }
        const temporaryToken = uuidv4();
        await ForgotPasswordRequests.create({
            _id: temporaryToken,
            userId: user._id,
        });
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        // Send the password reset email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password for Expensify Account",
            html: `To reset your password <a href="${process.env.CLIENT_ADDRESS}/reset-password?token=${temporaryToken}">Click Here</a>`
        });

        return res.status(200).json({
            success: true,
            message: "E-mail sent successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send mail"
        });
    }
}

const verifyToken = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Token not found"
        });
    }
    try {
        const forgottenPasswordRequest = await ForgotPasswordRequests.findOne({
            where: {
                _id: token
            }
        });
        
        if (forgottenPasswordRequest) {
            const expiresInDate = new Date(forgottenPasswordRequest.validity);
            const currentDate = new Date();
            if (expiresInDate < currentDate) {
                //check if session exists
                res.status(400).json({
                    success: false,
                    message: "token invalid"
                });
            }

            return res.status(200).json({
                success: true,
                message: "token valid"
            })
        }
        else {
            return res.status(404).json({
                success: false,
                message: "token invalid"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success: false,
            message: "token invalid"
        })
    }
};

const resetPassword = async (req, res, next) => {
    const { password, token } = req.body;
    console.log("token =" + token);
    console.log("pass =" + password);
    try {
        const forgottenPasswordRequest = await ForgotPasswordRequests.findOne({
            where: {
                _id: token
            }
        });
        const user = await Users.update(
            { password: await encrypt(password) },
            { where: { _id: forgottenPasswordRequest.userId } }
        );
        if (user) {
            await ForgotPasswordRequests.destroy(
                {
                    where: { _id: token },
                }
            );
            return res.status(201).json({
                success: true,
                message: "Password updated successfully"
            })
        }
        res.status(400).json({
            success: false,
            message: "password could not be updated"
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "password could not be updatedtoken invalid"
        });
    }
};

module.exports = {
    createUser,
    login,
    sendResetLink,
    verifyToken,
    resetPassword
}