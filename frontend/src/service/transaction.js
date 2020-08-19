import axios from 'axios'
import service from "./index"

const createTransaction = (transaction, recipientCharge, saveRecipient) => {
    return axios.post('/transaction', {
        transaction: transaction,
        recipient_charge: recipientCharge,
        save_recipient: saveRecipient,
    }, service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse)
}

export const transactionService = {
    createTransaction,
    getTransactions: _ => axios.get('/transaction', service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse),
    getAsTransactions: _ => axios.get('/transaction/admin',
        service.bearerHeader())
        .then(service.handleResponse)
        .catch(service.handleResponse),
}
