const express = require('express')

const router = express.Router()

router.use('/associate-bank', require('@src/api/associate_bank'))

module.exports = router
