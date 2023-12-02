const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Downloads = sequelize.define("downloads", {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Downloads;