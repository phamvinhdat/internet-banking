const express = require('express')
const authService = require('@be-src/service/auth')
const httpSttCode = require('http-status-codes')
const validator = require('@be-src/validator/auth')
const {validationResult} = require('express-validator')
const createError = require('http-errors')

const router = express.Router()

router.post('/', validator.postLogin(), async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        throw createError(httpSttCode.BAD_REQUEST, err.array()[0].msg)
    }

    const user = req.body
    const loginData = await authService
        .login(user.username, user.password, user.captcha_key)
    res.status(httpSttCode.OK)
        .json({
            message: 'login success',
            data: loginData
        })
})

module.exports = router
