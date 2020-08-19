const createError = require('http-errors')
const httpSttCode = require('http-status-codes')
const NotificationModel = require('@be-src/model/notifications')

module.exports = {
    getNotifications: async userID => {
        return await NotificationModel.findAll({
            where: {
                user_id: userID,
            }
        }).then(nt => {
            if (nt === null) {
                throw createError(httpSttCode.NOT_FOUND, 'Không có thông báo mới')
            }

            return nt
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })
    },

    createNotification: async (userID, type, message, amount) => {
        await NotificationModel.create({
            user_id: userID,
            type: type,
            message: message,
            amount: amount,
            read: false,
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })
    },

    unreadNoti: async notiID => {
        await NotificationModel.update({read: false}, {
            where: {
                id: notiID,
            }
        })
    }
}
