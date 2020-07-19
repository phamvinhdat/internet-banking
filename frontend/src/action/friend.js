import {message} from "antd";
import {friendService} from "../service/friend";
import {friendConstants} from "../contstant/friend";

const getFriend = _ => dispatch => {
    friendService.getFriend()
        .then(res => {
            const {data} = res
            dispatch({
                type: friendConstants.GET_FRIEND_SUCCESS,
                data
            })
        })
        .catch(_ => {
            dispatch({
                type: friendConstants.GET_FRIEND_FAILURE,
            })
        })
}

const createFriend = friend => dispatch => {
    friendService.createFriend(friend)
        .then(res => {
            message.success(res.message)
            dispatch(getFriend())
        })
        .catch(err => {
            message.error(err)
        })
}

const deleteFriend = friendAccountNumber => dispatch => {
    friendService.deleteFriend(friendAccountNumber)
        .then(res => {
            message.success(res.message)
            dispatch(getFriend())
        })
        .catch(err => {
            message.error(err)
        })
}

export const friendAction = {
    getFriend,
    createFriend,
    deleteFriend,
}
