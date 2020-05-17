const pgp = require('@src/utils/pgp')
const crypto = require('@src/utils/crypto')
const AssociateBankModel = require('@src/model/associate_banks')
const UserModel = require('@src/model/users')
const httpSttCode = require('http-status-codes')
const createError = require('http-errors')

module.exports = {
    getAccountInfo: async (bankCode, payload, signature) => {
        const associateBank = await AssociateBankModel.findOne({bank_code: bankCode})
        if (associateBank === null) {
            throw createError(httpSttCode.BAD_REQUEST, 'associate bank not found')
        }

        const genSig = crypto.encrypt(payload, associateBank.secret_key)
        if (genSig !== signature) {
            throw createError(httpSttCode.UNAUTHORIZED, 'signature can not verify')
        }

        const data = await pgp.decryptPGP(payload, associateBank.private_key)
        if (data.account_number === '') {
            throw createError(httpSttCode.BAD_REQUEST, 'account number is null')
        }

        const user = await UserModel.findOne({account_number: data.account_number})
        if (user === null) {
            throw createError(httpSttCode.NOT_FOUND, 'user not found')
        }

        return {
            name: user.name,
            account_number: user.account_number
        }
    }
}
