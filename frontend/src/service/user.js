import axios from "axios";
import config from "../config";
import service from "./index";
import store from 'store'

axios.defaults.baseURL = config.ROOT_API

const login = (username, password, captchaKey) => {
    return axios.post('/auth', {
        username: username,
        password: password,
        captcha_key: captchaKey
    })
        .then(service.handleResponse)
        .then(user => {
            store.set('user', user.data)
            return user
        })
        .catch(service.handleResponse)
}

const register = user => {
    return axios.post('/user/register', {
        name: user.name,
        email: user.email,
        password: user.password,
    }, service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse)
}

function logout() {
    // remove user from local storage to log user out
    store.clearAll()
}

export const userService = {
    login,
    logout,
    register,
    getUsers: _ => axios.get('/user', service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse),
    putStaffRole: (userID, type) => axios.put(`/user/role-staff/${userID}`,
        {type: type}, service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse)
}
