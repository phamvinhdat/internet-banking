import utils from "../util";
import httpSttCode from "http-status-codes";
import {userService} from './user'

const bearerHeader = _ => {
    return {
        headers: {Authorization: `Bearer ${utils.getToken()}`}
    }
}

const handleResponse = response => {
    const res = response.response || response

    if (res.status >= 300) {
        if (res.status === httpSttCode.UNAUTHORIZED) {
            userService.logout()
            //location.reload()
        }

        const err = (res.data && res.data.message) || res.statusText
        return Promise.reject(err)
    }

    return Promise.resolve(res.data)
}

const service = {
    bearerHeader,
    handleResponse,
}

export default service
