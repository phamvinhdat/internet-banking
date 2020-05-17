const cryptojs = require("crypto-js")


const crypto = {
    encrypt: (data, secretKey) => {
        return cryptojs.HmacSHA512(data, secretKey).toString()
    },
}

module.exports = crypto
