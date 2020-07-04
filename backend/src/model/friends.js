const {DataTypes} = require('sequelize');
const sequelize = require('./index')

const Friend = sequelize.define('friends', {
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    friend_account_number: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,
    },
    friend_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bank_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'YSB'
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    delete_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'friends'
});

module.exports = Friend
