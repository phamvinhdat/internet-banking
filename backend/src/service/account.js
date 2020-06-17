const AccountModel = require('@be-src/model/account')
const UserModel = require('@be-src/model/users')
const createError = require('http-errors')
const httpSttCode = require('http-status-codes')


module.exports = {
    getAccounts: async user_id => {
        let user = await UserModel.findOne({where: {id: user_id}})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.BAD_REQUEST, 'user not found')
                }
                return u
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        let accounts = await AccountModel.findOne({where: {user_id: user_id}})
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })
        accounts = accounts.map(a => ({
            name: a.name,
            balance: a.balance,
        }))

        return {
            main_account: {
                number: user.account_number,
                balance: user.balance,
            },
            saving_account: accounts,
        }
    },

    createSavingAccount: async (user_id, name, balance) => {
        await UserModel.findOne({where: {id: user_id}})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.BAD_REQUEST, 'user not found')
                }
                return u
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        await AccountModel.create({name: name, balance: balance})
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })
    }
}