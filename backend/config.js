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
}

const config = process.env.ENV === 'production' ? prod : dev

module.exports = config
