const sequelize = require('@be-src/model/index')
const createError = require('http-errors')
const httpSttCode = require('http-status-codes')
const UserModel = require('@be-src/model/users')
const TransactionModel = require('@be-src/model/transactions')
const config = require('@be-root/config')
const friendService = require('@be-src/service/friend')
const utils = require('./utils')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const moment = require('moment')

const moveMoneyFee = amount => config.MOVE_MONEY_FEE * amount / 100

const minSenderBalance = (recipientCharge, amount) => {
    if (recipientCharge) {
        return amount
    }

    return amount + moveMoneyFee(amount)
}

const moveMoneyYSBBank = async (transaction, sender, recipient, recipientCharge) => {
    if (sender.balance < minSenderBalance()) {
        throw createError(httpSttCode.NOT_ACCEPTABLE, "Số dư không đủ")
    }

    await sequelize.transaction(t => UserModel.update({
        balance: sender.balance - minSenderBalance(recipientCharge, transaction.amount)
    }, {
        transaction: t,
        where: {id: sender.id}
    }).then(_ => {
        const newBalance = recipient.balance + (recipientCharge ?
            transaction.amount - moveMoneyFee(transaction.amount) :
            transaction.amount)
        console.log(newBalance, recipient.balance, transaction.amount, "hihi")
        return UserModel.update({
            balance: newBalance
        }, {
            transaction: t,
            where: {account_number: transaction.receiver_account_number}
        }).then(_ => TransactionModel.create(transaction, {transaction: t}))
    })).catch(err => {
        throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
    })
}

const moveMoney = async (transaction, sender, recipient, recipientCharge) => {

    switch (transaction.receiver_bank_code) {
        case 'YSB':
            await moveMoneyYSBBank(transaction, sender, recipient, recipientCharge)
    }
}

module.exports = {
    moveMoney: async (transaction, recipientCharge, saveRecipient) => {
        const sender = await utils.getUserByCondition({
            account_number: transaction.sender_account_number,
        }, 'Không xác thực được thông tin người gửi, vui lòng thử lại')

        const recipient = await utils.getUserByCondition({
            account_number: transaction.receiver_account_number
        }, 'Người nhận không tồn tại')

        if (saveRecipient) {
            await friendService.createFriend(sender.id,
                transaction.receiver_account_number, recipient.name,
                recipient.bank_code)
        }

        await moveMoney(transaction, sender, recipient, recipientCharge)
    },
    getTransactions: async userID => {
        const user = await utils.getUserByCondition({
            id: userID,
        }, 'Không tìm thấy thông tin người dùng')

        const transactions = await TransactionModel.findAll({
            where: {
                [Op.or]: [
                    {receiver_account_number: user.account_number},
                    {sender_account_number: user.account_number}
                ],
                create_at: {
                    [Op.gte]: moment().subtract(30, 'days')
                }
            }
        }).then(r => {
            if (r === null) {
                throw createError(httpSttCode.NOT_FOUND, 'Không có giao dịch trong ngày')
            }

            return r
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })

        return transactions.map(transaction => ({
            type: transaction.receiver_account_number !== user.account_number ?
                'send' : 'receive',
            id: transaction.id,
            receiver_account_number: transaction.receiver_account_number,
            receiver_bank_code: transaction.receiver_bank_code,
            sender_account_number: transaction.sender_account_number,
            sender_bank_code: transaction.sender_bank_code,
            amount: transaction.amount,
            message: transaction.message,
            create_at: transaction.create_at
        }))
    }
}