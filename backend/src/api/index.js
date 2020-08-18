const express = require('express')
const middleware = require('@be-src/middleware/auth')
const consts = require('@be-src/consts/index')

const staffMiddleware = middleware.auth([consts.ROLE.STAFF])
const customerMiddleware = middleware.auth([consts.ROLE.CUSTOMER])

const router = express.Router()

router.use('/auth', require('@be-src/api/auth'))
router.use('/user', staffMiddleware, require('@be-src/api/user'))
router.use('/account', customerMiddleware, require('@be-src/api/account'))
router.use('/associate-bank', require('@be-src/api/associate_bank'))
router.use('/friend', customerMiddleware, require('@be-src/api/friend'))
router.use('/transaction', customerMiddleware, require('@be-src/api/transaction'))

module.exports = router
