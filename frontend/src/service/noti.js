import axios from 'axios'
import service from "./index"

const getNotis = _ => {
    return axios.get('/notification', service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse)
}

const createNoti = noti => {
    return axios.post('/notification', {...noti}, service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse)
}

const readNoti = notiID => axios.put(`notification/${notiID}`, {},
    service.bearerHeader())
    .then(service.handleResponse)
    .catch(service.handleResponse)

export const notiService = {
    getNotis,
    createNoti,
    readNoti,
}
