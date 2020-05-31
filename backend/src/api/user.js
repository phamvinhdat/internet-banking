const express = require('express')
const userService = require('@src/service/user')
const httpSttCode = require('http-status-codes')
const validator = require('@src/validator/user')
const {validationResult} = require('express-validator')
const createError = require('http-errors')

const router = express.Router()

/*
    body: {
        name: 'phạm vĩnh đạt',
        email: 'phamvinhdat1998@gmail.com',
        password: '123456',
        balance: 1000000
    }
*/
router.post('/register', validator.postRegister(), async (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        throw createError(httpSttCode.BAD_REQUEST, err.array()[0].msg)
    }
    const defaultRoles = [{id: 1, name: 'customer'}]
    const user = await userService.createUser(req.body, defaultRoles)
    res.status(httpSttCode.CREATED)
        .json({
            message: 'success',
            data: {
                user: user,
            }
        })
})

module.exports = router