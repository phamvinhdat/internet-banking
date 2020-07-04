const express = require('express')
const friendService = require('@be-src/service/friend')
const httpSttCode = require('http-status-codes')

const router = express.Router()

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
    const friends = await friendService.getFriend(req.userID)
    res.status(httpSttCode.OK)
        .json({
            message: 'Lấy thông tin thành công',
            data: friends
        })
})

module.exports = router
