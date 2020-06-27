const getToken = _ => {
    const authStr = localStorage.getItem('user')
    if (!authStr) {
        return ''
    }
    const auth = JSON.parse(authStr)
    return auth.token || ''
}

const utils = {
    getToken,
}

export default utils
