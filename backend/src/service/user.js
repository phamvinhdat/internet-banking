const UserModel = require('@be-src/model/users')
const httpSttCode = require('http-status-codes')
const createError = require('http-errors')
const sequelize = require('@be-src/model/index')
const UserRoles = require('@be-src/model/user_roles')
const crypto = require('@be-src/utils/crypto')
const generator = require('@be-src/utils/generator')
const consts = require('@be-src/consts/index')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

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
    checkRoleUser: async (userID, roles) => {
        await UserModel.findOne({where: {id: userID}})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.NOT_FOUND, 'user not exists')
                }
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        const userRoles = await UserRoles.findAll({where: {user_id: userID}})
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        roles.forEach(r => {
            const found = userRoles.find(ur => ur.role_id === r)
            if (!found) {
                throw createError(httpSttCode.NOT_ACCEPTABLE, "access denied")
            }
        })
    },
    getUserByID: async userID => {
        let user = await UserModel.findOne({where: {id: userID}})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.NOT_FOUND, 'user not exists')
                }
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

    },
    getUsers: async adminID => {
        const users = await UserModel.findAll({
            where: {
                id: {
                    [Op.ne]: adminID
                },
            }
        }).then(us => {
            if (us === null) {
                throw createError(httpSttCode.NOT_FOUND, 'user not exists')
            }

            return us
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })

        let userReturn = []
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const userRoles = await UserRoles.findAll({where: {user_id: user.id}})
                .catch(err => {
                    throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
                })
            userReturn[i] = {
                id: user.id,
                email: user.email,
                account_number: user.account_number,
                roles: userRoles
            }
        }

        return userReturn
    },

    removeStaffRole: async userID => {
        await UserRoles.findOne({
            where: {
                user_id: userID,
                role_id: 2,
            }
        }).then(us => {
            if (us === null) {
                return
            }

            UserRoles.destroy({
                where: {
                    user_id: userID,
                    role_id: 2,
                }
            })
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })
    },

    setStaffRole: async userID => {
        await UserRoles.findOne({
            where: {
                user_id: userID,
                role_id: 2,
            }
        }).then(us => {
            if (us !== null) {
                return
            }

            UserRoles.create({
                user_id: userID,
                role_id: 2,
            })
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })
    },
}
