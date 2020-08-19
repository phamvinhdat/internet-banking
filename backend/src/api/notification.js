const express = require('express')
const notificationService = require('@be-src/service/notification')
const httpSttCode = require('http-status-codes')
const utils = require('../service/utils')

const router = express.Router()

router.get('/', async (req, res) => {
    const notifications = await notificationService.getNotifications(req.userID)

    let count = 0
    notifications.forEach(nt => {
        if (nt.read === false) {
            count++
        }
    })

    res.status(httpSttCode.OK)
        .json({
            message: 'Lấy thông báo mới thành công',
            data: {
                data: notifications,
                count: count,
            }
        })
})

router.post('/', async (req, res) => {
    console.log(req.body)

    const body = req.body
    let userID
    if (body.account_number) {
        const user = await utils.getUserByCondition({
            account_number: body.account_number,
        }, 'Người dùng không tồn tại')

        userID = user.id
    } else {
        userID = body.user_id
    }

    await notificationService.createNotification(userID, body.type,
        body.message, body.amount)

    res.status(httpSttCode.CREATED)
        .json({
            message: 'Tạo thông báo thành công',
        })
})

router.put('/:notiID', async (req, res) => {
    const notiID = req.params.notiID
    await notificationService.unreadNoti(notiID)
    res.status(httpSttCode.CREATED)
        .json({
            message: 'Đã đọc thông báo',
        })
})

module.exports = router