const pgp = require('@src/utils/pgp')
const crypto = require('@src/utils/crypto')
const AssociateBankModel = require('@src/model/associate_banks')
const UserModel = require('@src/model/users')
const httpSttCode = require('http-status-codes')
const createError = require('http-errors')

const decode = async (bankCode, payload, signature) => {
    const associateBank = await AssociateBankModel.findOne({bank_code: bankCode})
        .then(ab => {
            if (ab === null) {
                throw createError(httpSttCode.BAD_REQUEST, 'associate bank not found')
            }
        })
        .catch(err => {
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })

    const genSig = crypto.encryptSHA512(payload, associateBank.secret_key)
    if (genSig !== signature) {
        throw createError(httpSttCode.UNAUTHORIZED, 'signature can not verify')
    }

    return await pgp.decryptPGP(payload, associateBank.private_key)
}

module.exports = {
    getAccountInfo: async (bankCode, payload, signature) => {
        const data = await decode(bankCode, payload, signature)
        if (!data.hasOwnProperty('account_number')) {
            throw createError(httpSttCode.BAD_REQUEST, 'account number is null')
        }

        const user = await UserModel.findOne({account_number: data.account_number})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.NOT_FOUND, 'user not found')
                }
            })
            .catch(httpSttCode.INTERNAL_SERVER_ERROR, err)

        return {
            name: user.name,
            account_number: user.account_number
        }
    },

    transfer: async (bankCode, payload, signature) => {
        const data = await decode(bankCode, payload, signature)
        if (!data.hasOwnProperty('account_number') || !data.hasOwnProperty('value')) {
            throw createError(httpSttCode.BAD_REQUEST, 'data invalid')
        }
        if (data.value <= 0) {
            throw createError(httpSttCode.BAD_REQUEST, 'the value must be a positive value')
        }

        user = await UserModel.findOne({account_number: data.account_number})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.NOT_FOUND, 'user not found')
                }
            })
            .catch(err => {
                console.error(err)
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        await user.update({
            balance: user.balance + value
        }).catch(err => {
            console.error(err)
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })

        return {
            new_balance: user.balance
        }
    }
}
