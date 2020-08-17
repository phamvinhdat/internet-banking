const UserModel = require('@be-src/model/users')
const UserRoleModel = require('@be-src/model/user_roles')
const RoleModel = require('@be-src/model/roles')
const httpSttCode = require('http-status-codes')
const createError = require('http-errors')
const crypto = require('@be-src/utils/crypto')
const generator = require('@be-src/utils/generator')
const {v4: uuidv4} = require('uuid')
const axios = require('axios')
const config = require("../../config")

module.exports = {
    login: async (username, password, captchaKey) => {

        await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${config.CAPTCHA_SECRET_KEY}&response=${captchaKey}`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                }
            })
            .then(res => {
                const data = res.data
                console.log(data

                )
                if (!data.success) {
                    throw createError(httpSttCode.BAD_REQUEST, 'captcha không đúng')
                }
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        const errUsernamePassword = createError(httpSttCode.UNAUTHORIZED,
            'username and password do not match any accounts')
        let user = await UserModel.findOne({where: {email: username}})
            .then(u => {
                if (u === null) {
                    throw errUsernamePassword
                }
                return u
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        const hashPassword = crypto.encryptSHA3(password)
        if (user.password !== hashPassword) {
            throw errUsernamePassword
        }

        // get roles
        const roles = await RoleModel.findAll()
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        // get role
        const userRoles = await UserRoleModel.findAll({
            where: {
                user_id: user.id,
            }
        }).catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })
        const mapRoles = userRoles.map(role => {
            const r = roles.find(r => r.id === role.role_id)
            return {
                id: r.id,
                role: r.role,
            }
        })

        // correct username and password
        // gen refresh token
        const refreshToken = uuidv4()
        await user.update({
            refresh_token: refreshToken
        }).catch(err => {
            console.error(err)
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })
        // gen token
        const jwtToken = generator.jwtToken(user.id)
        return {
            token: jwtToken,
            refresh_token: refreshToken,
            roles: mapRoles,
        }
    },

    refreshToken: (userID, refreshToken) => {
        let user = UserModel.findOne({id: userID})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.BAD_REQUEST, 'user not found')
                }
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        if (user.refresh_token !== refreshToken) {
            throw createError(httpSttCode.UNAUTHORIZED,
                'token invalid, please login!')
        }

        // gen token
        const jwtToken = generator.jwtToken(userID)
        return {
            token: jwtToken,
        }
    }
}