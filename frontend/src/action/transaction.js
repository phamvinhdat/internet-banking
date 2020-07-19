import {message} from "antd";
import {transactionService} from "../service/transaction";
import {accountAction} from "./account"
import {friendAction} from "./friend";

const createTransaction = (transaction, recipientCharge, saveRecipient) => {
    return dispatch => {
        transactionService.createTransaction(transaction, recipientCharge,
            saveRecipient)
            .then(res => {
                dispatch(accountAction.getAccounts())
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
}
