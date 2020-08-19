import {notiConstants} from "../contstant/noti";

export const notis = (state = [], action) => {
    switch (action.type) {
        case notiConstants.GET_NOTI_SUCCESS:
            return action.data
        case notiConstants.GET_NOTI_FAILURE:
            return []
        default:
            return state
    }
}
