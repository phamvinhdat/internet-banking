import {transactionConstants} from "../contstant/transaction";

export const transactions = (state = [], action) => {
    switch (action.type) {
        case transactionConstants.GET_TRANSACTION_SUCCESS:
            return action.data
        case transactionConstants.GET_TRANSACTION_FAILURE:
            return []
        default:
            return state
    }
}