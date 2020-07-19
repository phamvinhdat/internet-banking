const createError = require('http-errors')
const httpSttCode = require('http-status-codes')
const FriendModel = require('@be-src/model/friends')
const utilsService = require('@be-src/service/utils')

module.exports = {
    getFriends: async userID => {
        const friends = await FriendModel.findAll({
            where: {
                user_id: userID,
            }
        }).then(fs => {
            if (fs === null) {
                throw createError(httpSttCode.NO_CONTENT, '')
            }
            return fs
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })

        return friends.map(f => ({
            friend_name: f.friend_name,
            friend_account_number: f.friend_account_number,
            bank_code: f.bank_code,
        }))
    },

    createFriend: async (userID, friendAccountNumber, name, bankCode) => {
        if (bankCode === 'YSB') {
            await utilsService.getUserByCondition({
                account_number: friendAccountNumber,
                bank_code: bankCode,
            }, 'Người dùng không tồn tại trên hệ thống')
        }

        await FriendModel.findOne({
            where: {
                user_id: userID,
                friend_account_number: friendAccountNumber,
            }
        }).then(f => {
            if (f !== null) {
                return
            }

            FriendModel.create({
                user_id: userID,
                friend_account_number: friendAccountNumber,
                friend_name: name,
                bank_code: bankCode,
            })
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })
    },

    deleteFriend: async (userID, friendAccountNumber) => {
        await FriendModel.destroy({
            where: {
                friend_account_number: friendAccountNumber,
                user_id: userID,
            }
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })
    }
}
