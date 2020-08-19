import {message} from "antd";
import {userConstants} from "../contstant/user";
import {userService} from "../service/user";
import history from '../util/history/index'

const login = (username, password, captchaKey) => {
    const request = user => {
        message.loading('Vui lòng chờ ...', 0)
        return {type: userConstants.LOGIN_REQUEST, user}
    }

    const success = user => {
        message.destroy()
        message.success(user.message)
        let {data} = user
        return {type: userConstants.LOGIN_SUCCESS, data}
    }

    const failure = err => {
        message.destroy()
        return {type: userConstants.LOGIN_FAILURE, err}
    }

    return dispatch => {
        dispatch(request({username}))
        userService.login(username, password, captchaKey)
            .then(user => {
                dispatch(success(user))
                history.push('/')
                window.location.reload()
            })
            .catch(err => {
                dispatch(failure(err.toString()))
                message.error(err.toString())
            })
    }
}

const getUsers = _ => dispatch => userService.getUsers()
    .then(res => {
        const {data} = res
        dispatch({
            type: userConstants.GET_USER_SUCCESS,
            data
        })
    }).catch(err => {
        message.error(err.toString())
        dispatch({
            type: userConstants.GET_USER_FAILURE
        })
    })

const register = user => {
    return dispatch => {
        userService.register(user)
            .then(res => {
                message.success(res.message)
                dispatch(getUsers())
            })
            .catch(err => {
                message.error(err)
            })
    }
}

const putStaffRole = (userID, type) => dispatch => userService
    .putStaffRole(userID, type)
    .then(_ => {
        dispatch(getUsers())
    })
    .catch(err => {
        message.error(err)
    })

const logout = _ => {
    userService.logout()
    return {type: userConstants.LOGOUT}
}

export const userAction = {
    login,
    logout,
    register,
    getUsers,
    putStaffRole,
}
