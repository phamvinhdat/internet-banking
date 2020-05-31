const UserModel = require('@src/model/users')
const httpSttCode = require('http-status-codes')
const createError = require('http-errors')
const crypto = require('@src/utils/crypto')
const generator = require('@src/utils/generator')
const {v4: uuidv4} = require('uuid');


module.exports = {
    login: async (username, password) => {
        const errUsernamePassword = createError(httpSttCode.UNAUTHORIZED,
            'username and password do not match any accounts')
        let user = await UserModel.findOne({email: username})
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
        console.log(user.password, hashPassword)
        if (user.password !== hashPassword) {
            throw errUsernamePassword
        }

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
            refresh_token: refreshToken
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