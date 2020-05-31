import {message} from "antd";
import {userConstants} from "../contstant/user";
import {userService} from "../service/user";

const login = (username, password) => {
    const request = user => {
        message.loading('Vui lòng chờ ...', 0)
        return {type: userConstants.LOGIN_REQUEST, user}
    }

    const success = user => {
        message.destroy()
        return {type: userConstants.LOGIN_SUCCESS, user}
    }

    const failure = err => {
        message.destroy()
        return {type: userConstants.REGISTER_FAILURE, err}
    }

    return dispatch => {
        dispatch(request({username}))
        userService.login(username, password)
            .then(user => {
                dispatch(success(user))
            })
            .catch(err => {
                dispatch(failure(err.toString()))
                message.error(err.toString())
            })
    }
}

export const userAction = {
    login,
}
