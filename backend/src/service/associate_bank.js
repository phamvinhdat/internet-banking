const pgp = require('@be-src/utils/pgp')
const crypto = require('@be-src/utils/crypto')
const AssociateBankModel = require('@be-src/model/associate_banks')
const UserModel = require('@be-src/model/users')
const httpSttCode = require('http-status-codes')
const createError = require('http-errors')
const uuid = require('uuid')
const TransactionModel = require('@be-src/model/transactions')
const notiService = require('./notification')

const decode = async (bankCode, payload, signature) => {
    const associateBank = await AssociateBankModel.findOne({where: {bank_code: bankCode}})
        .then(ab => {
            if (ab === null) {
                throw createError(httpSttCode.BAD_REQUEST, 'associate bank not found')
            }
            return ab
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
    prepareData: async (privateKey, pgpPublicKey, data) => {
        const payload = await pgp.encryptPGP(data, pgpPublicKey)
        const genSig = crypto.encryptSHA512(payload, privateKey)
        return {
            payload: payload,
            signature: genSig
        }
    },

    associateBankCreating: async (bankCode, name) => {
        await AssociateBankModel.findOne({where: {bank_code: bankCode}})
            .then(ab => {
                if (ab !== null) {
                    throw createError(httpSttCode.BAD_REQUEST, 'Ngân hàng đã liên kết với hệ thông, liên hệ quản trị viên để biết thêm thôn tin')
                }
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        const pgpObj = await pgp.generatePGPKey({
            name: name,
            bank_code: bankCode,
        })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        const secretKey = uuid.v4()
        await AssociateBankModel.create({
            bank_code: bankCode,
            name: name,
            private_key: `${pgpObj.privateKeyArmored}`,
            public_key: `${pgpObj.publicKeyArmored}`,
            secret_key: secretKey,
        })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        return {
            public_key: pgpObj.publicKeyArmored,
            secret_key: secretKey,
        }
    },

    getAccountInfo: async (bankCode, payload, signature) => {
        const data = await decode(bankCode, payload, signature)
        if (!data.hasOwnProperty('account_number')) {
            throw createError(httpSttCode.BAD_REQUEST, 'account number is null')
        }

        const user = await UserModel.findOne({where: {account_number: data.account_number}})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.NOT_FOUND,
                        'Số tài khoản không tồn tại')
                }

                return u
            })
            .catch(err => {
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

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

        user = await UserModel.findOne({where: {account_number: data.account_number}})
            .then(u => {
                if (u === null) {
                    throw createError(httpSttCode.NOT_FOUND, 'user not found')
                }
                return u
            })
            .catch(err => {
                console.error(err)
                throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
            })

        await user.update({
            balance: user.balance + data.value
        }).catch(err => {
            console.error(err)
            throw createError(httpSttCode.INTERNAL_SERVER_ERROR, err)
        })

        await TransactionModel.create({
            receiver_account_number: data.account_number,
            receiver_bank_code: 'YSB',
            sender_account_number: 0,
            sender_bank_code: bankCode,
            amount: data.value,
        }).catch(err => {
            console.log('failed to create transaction', err)
        })

        await notiService.createNotification(user.id, 'Nhận chuyển khoản',
            `Nhận chuyển khoản từ ngân hàng ${bankCode}`, data.value)

        return {
            new_balance: user.balance
        }
    }
}
