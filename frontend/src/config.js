const dev = {
    PORT: 3000,
    ROOT_API: 'http://localhost:8080/api/v1',
    CAPTCHA_SITE_KEY: '6LfcBMAZAAAAABUiVFjfmiWUH4h4LSdq9msKaqGF'
}

const prod = {
    ROOT_API: 'https://yasuobank.herokuapp.com/api/v1',
    CAPTCHA_SITE_KEY: '6Lfgkb8ZAAAAAAds6IKHgOXG_MbPKBpXehvY5i9L'
}

const config = process.env.REACT_APP_ENV === 'production' ? prod : dev
export default {...config}
