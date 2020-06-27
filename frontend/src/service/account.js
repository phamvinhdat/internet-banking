import axios from "axios";
import service from "./index"

const getAccount = _ => {
    return axios.get('/account', service.bearerHeader)
        .then(service.handleResponse)
        .catch(service.handleResponse)
}

const createSavingAccount = (name, balance) => {
    return axios.post('/account',{
        name: name,
        balance: balance
    }, service.bearerHeader)
        .then(service.handleResponse)
        .catch(service.handleResponse)
}

export const accountService = {
    getAccount,
    createSavingAccount,
}
