const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Orders = sequelize.define('orders', {
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    paymentId: {
        type: DataTypes.STRING,
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Orders;