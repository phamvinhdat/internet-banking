const express = require('express')
const accountService = require('@be-src/service/account')
const httpSttCode = require('http-status-codes')

const router = express.Router()

const accountNumberParam = 'accountNumber'

router.get('/', async (req, res) => {
    const accounts = await accountService.getAccount(req.userID)
    res.status(httpSttCode.OK)
        .json({
            message: 'success',
            data: {
                ...accounts
            }
        })
})

router.get(`/:${accountNumberParam}/info`, async (req, res) => {
    const accountNumber = req.params[accountNumberParam]
    const accountInfo = await accountService.getAccountInfo(req.userID, accountNumber)
    res.status(httpSttCode.OK)
        .json({
            message: 'Lấy thông tin tài khoản thành công',
            data: {
                ...accountInfo
            }
        })
})

router.post('/', async (req, res) => {
    const savingAccount = req.body
    await accountService.createSavingAccount(req.userID, savingAccount.name, savingAccount.balance)
    res.status(httpSttCode.CREATED)
        .json({
            message: `Tạo tài khoản ${savingAccount.name}, tài khoản thanh toán giảm: ${savingAccount.balance}`
        })
})

router.delete('/saving/:savingAccountID', async (req, res) => {
    const userID = req.userID
    const savingAccountID = req.params.savingAccountID
    await accountService.deleteSavingAccount(savingAccountID, userID)
    res.status(httpSttCode.OK)
        .json({
            message: 'Xóa tài khoản tiết kiệm thành công, số tiền trong tài khoản này đã được chuyển vào tài khoản thanh toán',
        })
})

router.put('/saving/:savingAccountID', async (req, res) => {
    const savingAccountID = req.params.savingAccountID
    const userID = req.userID
    const data = req.body
    await accountService.updateSavingAccount(data.name, data.delta_balance,
        userID, savingAccountID)
    res.status(httpSttCode.OK)
        .json({
            message: 'Cập nhật thông tin ví thành công'
        })
})

module.exports = router
