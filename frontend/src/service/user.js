import axios from "axios";
import config from "../config";
import httpSttCode from 'http-status-codes'

axios.defaults.baseURL = config.ROOT_API

const login = (username, password) => {
    return axios.post('/auth', {
        username: username,
        password: password
    })
        .then(_handleResponse)
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user))
            return user
        })
        .catch(_handleResponse)
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

const _handleResponse = response => {
    const res = response.response || response
    console.log(res.data)

    if (res.status >= 300) {
        if (res.status === httpSttCode.UNAUTHORIZED) {
            logout()
            //location.reload()
        }

        const err = (res.data && res.data.message) || res.statusText
        return Promise.reject(err)
    }

    return Promise.resolve(res.data)
}

export const userService = {
    login,
    logout,
}
