const express = require('express')
const middleware = require('@be-src/middleware/auth')
const consts = require('@be-src/consts/index')

const staffMiddleware = middleware.auth([consts.ROLE.STAFF])
const customerMiddleware = middleware.auth([consts.ROLE.CUSTOMER])

const router = express.Router()

router.use('/auth', require('@be-src/api/auth'))
router.use('/user', require('@be-src/api/user'))
router.use('/account', customerMiddleware, require('@be-src/api/account'))
router.use('/associate-bank', require('@be-src/api/associate_bank'))

module.exports = router
