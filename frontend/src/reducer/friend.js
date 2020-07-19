import {friendConstants} from "../contstant/friend";

export const friend = (state = [], action) => {
    switch (action.type) {
        case friendConstants.GET_FRIEND_SUCCESS:
            return action.data
        case friendConstants.GET_FRIEND_FAILURE:
            return []
        default:
            return state
    }
}
