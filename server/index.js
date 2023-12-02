require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./utils/database');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const ForgotPasswordRequest = require('./models/forgotPasswordRequests');
const Download = require("./models/downloads");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

Download.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Download, { foreignKey: "userId" });

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);

async function startServer() {
    try {
        // await sequelize.sync({force: true});
        await sequelize.sync();
        app.listen(port, () => {
            console.log(`Server running on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();