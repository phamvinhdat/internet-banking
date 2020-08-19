const express = require('express')
const transactionService = require('@be-src/service/transaction')
const httpSttCode = require('http-status-codes')
const utilsService = require('@be-src/service/utils')

const router = express.Router()

router.post('/', async (req, res) => {
    const transaction = req.body.transaction
    const sender = await utilsService.getUserByCondition({
        id: req.userID
    }, "Người dùng không thể xác minh, vui lòng thử lại", httpSttCode.UNAUTHORIZED)

    transaction.sender_account_number = sender.account_number
    transaction.sender_bank_code = sender.bank_code
    await transactionService.moveMoney(transaction, req.body.recipient_charge,
        req.body.save_recipient)
    res.status(httpSttCode.CREATED)
        .json({
            message: 'Giao dịch thành công'
        })
})

router.get('/', async (req, res) => {
    const transactions = await transactionService.getTransactions(req.userID)
    res.status(httpSttCode.OK)
        .json({
            message: 'Lấy thông tin giao dịch thành công',
            data: transactions
        })
})

router.get('/admin', async (req, res) => {
    const transactions = await transactionService.getAsTransactions()
    res.status(httpSttCode.OK)
        .json({
            message: 'Lấy thông tin giao dịch thành công',
            data: transactions
        })
})

module.exports = router
