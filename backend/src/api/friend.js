const express = require('express')
const friendService = require('@be-src/service/friend')
const httpSttCode = require('http-status-codes')

const router = express.Router()

const accountNumberParam = 'accountNumber'

router.post('/', async (req, res) => {
    const friend = req.body
    await friendService.createFriend(req.userID, friend.friend_account_number,
        friend.friend_name, friend.bank_code)
    res.status(httpSttCode.CREATED)
        .json({
            message: 'Tạo gợi nhớ thành công'
        })
})

router.get('/', async (req, res) => {
    const friends = await friendService.getFriends(req.userID)
    res.status(httpSttCode.OK)
        .json({
            message: 'Lấy thông tin thành công',
            data: friends
        })
})

router.put(`/:${accountNumberParam}`, async (req, res) => {
    const accountNumber = req.params[accountNumberParam]
    await friendService.updateFriend(req.userID, accountNumber, req.body.new_name)

    res.status(httpSttCode.OK)
        .json({
            message: 'Cập nhật tên thành công',
        })
})

router.delete(`/:${accountNumberParam}`, async (req, res) => {
    const accountNumber = req.params[accountNumberParam]
    await friendService.deleteFriend(req.userID, accountNumber)

    res.status(httpSttCode.OK)
        .json({
            message: 'Xóa gợi nhớ thành công',
        })
})

module.exports = router
