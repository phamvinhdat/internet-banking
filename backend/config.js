const dev = {
    PGP_SECRET_KEY: "The quick brown fox jumps over the lazy dog",
    JWT: {
        SECRET_KEY: "The quick brown fox jumps over the lazy dog",
        EXPIRATION_TIME: '1h'
    },
    DATABASE: {
        URL: 'mysql://root:root@localhost:3306/yasuobank'
    },
    MOVE_MONEY_FEE: 5
}

const prod = {
    PGP_SECRET_KEY: "The quick brown fox jumps over the lazy dog",
    JWT: {
        SECRET_KEY: "The quick brown fox jumps over the lazy dog",
        EXPIRATION_TIME: '1h'
    },
    DATABASE: {
        URL: 'mysql://dk1rdru82t8fvxue:u2o7k2o3v2mrx2p9@zpj83vpaccjer3ah.chr7pe7iynqr.eu-west-1.rds.amazonaws.com:3306/xcr30w5a4ngim28p'
    }
}

const config = process.env.ENV === 'production' ? prod : dev

module.exports = config
