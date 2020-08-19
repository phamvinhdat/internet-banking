const express = require('express')
const notificationService = require('@be-src/service/notification')
const httpSttCode = require('http-status-codes')

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
    const body = req.body
    await notificationService.createNotification(body.user_id, body.type,
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