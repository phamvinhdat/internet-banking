import axios from 'axios'
import service from "./index"

const getFriend = _ => {
    return axios.get('/friend', service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse)
}

const createFriend = friend => {
    return axios.post('/friend', {...friend}, service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse)
}

const deleteFriend = friendAccountNumber => axios.delete(
    `/friend/${friendAccountNumber}`, service.bearerHeader())
    .then(service.handleResponse)
    .catch(service.handleResponse)

export const friendService = {
    getFriend,
    createFriend,
    deleteFriend,
}
