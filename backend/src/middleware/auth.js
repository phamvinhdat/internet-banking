const jwt = require('jsonwebtoken')
const httpSttCode = require('http-status-codes')


const auth = (req, res, next) => {
    try {
        const token = req.header.authorization.split(' ')[1]
        
    } catch {
        res.status(httpSttCode.UNAUTHORIZED, 'unauthorized')
    }
}
