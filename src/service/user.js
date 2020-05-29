const UserModel = require('@src/model/users')
const httpSttCode = require('http-status-codes')
const createError = require('http-errors')
const sequelize = require('@src/model/index')
const UserRoles = require('@src/model/user_roles')
const crypto = require('@src/utils/crypto')
const generator = require('@src/utils/generator')
const consts = require('@src/consts/index')


module.exports = {
    createUser: async (user, roles) => {
        // hash password
        user.password = crypto.encryptSHA3(user.password)
        user.account_number = generator.uid()
        user.bank_code = consts.BANK_CODE

        // create user with transaction
        await sequelize.transaction(t => {
            return UserModel.create(user, {transaction: t})
                .then(u => {
                    let promises = []
                    roles.forEach(role => promises.push(
                        UserRoles.create({
                            user_id: u.id,
                            role_id: role.id,
                        }, {transaction: t})
                    ))
                    return Promise.all(promises)
                })
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err.toString())
        })

        delete user.password
        return user
    },
}
