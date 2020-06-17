const express = require('express')

const router = express.Router()

router.use('/auth', require('@be-src/api/auth'))
router.use('/user', require('@be-src/api/user'))
router.use('/account', require('@be-src/api/account'))
router.use('/associate-bank', require('@be-src/api/associate_bank'))

module.exports = router
