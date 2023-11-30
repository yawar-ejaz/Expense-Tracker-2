const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests', {
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    validity: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(Date.now() + 10 * 60 * 1000),
    }
});

module.exports = ForgotPasswordRequests;