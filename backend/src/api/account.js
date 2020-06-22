const express = require('express')
const accountService = require('@be-src/service/account')
const httpSttCode = require('http-status-codes')

const router = express.Router()

router.get('/', async (req, res) => {
    const accounts = await accountService.getAccount(req.userID)
    res.status(httpSttCode.OK)
        .json({
            message: 'success',
            data: {
                ...accounts
            }
        })
})

module.exports = router
