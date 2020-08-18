import {message} from "antd";
import {transactionConstants} from "../contstant/transaction";
import {transactionService} from "../service/transaction";
import {accountAction} from "./account"
import {friendAction} from "./friend";

const getTransactions = _ => dispatch => transactionService.getTransactions()
    .then(res => {
        const {data} = res
        dispatch({
            type: transactionConstants.GET_TRANSACTION_SUCCESS,
            data
        })
    }).catch(err => {
        message.error(err.toString())
        dispatch({
            type: transactionConstants.GET_TRANSACTION_FAILURE
        })
    })

const createTransaction = (transaction, recipientCharge, saveRecipient) => {
    return dispatch => {
        transactionService.createTransaction(transaction, recipientCharge,
            saveRecipient)
            .then(res => {
                dispatch(accountAction.getAccounts())
                dispatch(getTransactions())
                message.success(res.message)

                if (saveRecipient) {
                    dispatch(friendAction.getFriend())
                }
            })
            .catch(err => {
                message.error(err.toString())
            })
    }
}

export const transactionAction = {
    createTransaction,
    getTransactions,
}
