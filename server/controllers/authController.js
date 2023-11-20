const Users = require("../models/users");
const { encrypt, isMatching } = require("../utils/hashing");
const createToken = require("../utils/createToken");

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

module.exports = {
    createUser,
    login
}