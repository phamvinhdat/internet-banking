const express = require('express')
const httpSttCode = require('http-status-codes')
const associateBankService = require("@be-src/service/associate_bank")
const createError = require('http-errors')
const validator = require('@be-src/validator/associate_bank')

const router = express.Router()

const BANK_CODE = 'bankCode'

/*
    body: { // pgp encrypt with public key
        payload: {
            account_number: '1234656789', // string, account number of user
        },
        signature: 'sdfsdfdsfsdsdfsdf' // HmacSHA512 of payload and secret_key
    }
 */
router.post(`/:${BANK_CODE}/account-info`, validator.pgpProtocol(), async (req, res) => {
    const bankCode = req.param(BANK_CODE)

    const payload = unescape(req.body.payload)
    const accountInfo = await associateBankService.getAccountInfo(bankCode,
        payload, req.body.signature)

    res.status(httpSttCode.OK)
        .json({
            message: 'success',
            data: accountInfo
        })
})

router.post(`/:${BANK_CODE}/transfer`, async (req, res) => {
    const bankCode = req.param(BANK_CODE)
    if (bankCode === '') {
        throw createError(httpSttCode.BAD_REQUEST, 'bank code is null')
    }

    if (!req.body.signature || !req.body.payload) {
        throw createError(httpSttCode.BAD_REQUEST,
            'signature or (and) payload is null')
    }

    const transferInfo = await associateBankService.transfer(bankCode,
        req.body.payload, req.body.signature)

    res.status(httpSttCode.OK)
        .json({
            message: 'success',
            data: transferInfo
        })
})

router.post('/', async (req, res) => {
    const body = req.body
    const associcateBankInfo = await associateBankService
        .associateBankCreating(body.bank_code, body.name)
    
    res.status(httpSttCode.OK)
        .json({
            message: 'success',
            data: associcateBankInfo
        })
})

router.put('/', async (req, res) => {
    const body = req.body
    const publicKey = unescape(body.public_key)
    const data = await associateBankService
        .prepareData(body.secret_key, publicKey, body.data)
        res.status(httpSttCode.OK)

    res.status(httpSttCode.OK)
        .json({
            message: 'success',
            data: data
        })
})

module.exports = router
