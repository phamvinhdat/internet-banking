const dev = {
    PGP_SECRET_KEY: "The quick brown fox jumps over the lazy dog",
    DATABASE: {
        URL: 'mysql://root:root@localhost:3306/yasuobank'
    }
}

const prod = {
    PGP_SECRET_KEY: "The quick brown fox jumps over the lazy dog"
}

const config = process.env.ENV === 'production' ? prod : dev

module.exports = config
