const express = require('express')

const router = express.Router()

router.use('/auth', require('@src/api/auth'))
router.use('/user', require('@src/api/user'))
router.use('/associate-bank', require('@src/api/associate_bank'))

module.exports = router
