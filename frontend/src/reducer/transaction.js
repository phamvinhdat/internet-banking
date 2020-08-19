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

export const asTransactions = (state = [], action) => {
    switch (action.type) {
        case transactionConstants.GET_AS_TRANSACTION_SUCCESS:
            return action.data
        case transactionConstants.GET_AS_TRANSACTION_FAILURE:
            return []
        default:
            return state
    }
}
