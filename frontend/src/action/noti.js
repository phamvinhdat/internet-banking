import {message} from "antd";
import {notiConstants} from "../contstant/noti";
import {notiService} from "../service/noti";

const getNotis = _ => dispatch => {
    notiService.getNotis()
        .then(res => {
            const {data} = res
            dispatch({
                type: notiConstants.GET_NOTI_SUCCESS,
                data,
            })
        })
        .catch(_ => {
            dispatch({
                type: notiConstants.GET_NOTI_FAILURE,
            })
        })
}

const createNoti = noti => dispatch => {
    notiService.createNoti(noti)
        .catch(err => {
            message.error(err)
        })
}

const readNoti = notiID => dispatch => {
    notiService.readNoti(notiID)
        .then(_ => {
            dispatch(getNotis())
        })
        .catch(err => {
            message.error(err)
        })
}

export const notiAction = {
    createNoti,
    readNoti,
    getNotis,
}
