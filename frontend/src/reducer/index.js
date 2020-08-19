import {combineReducers} from "redux"
import {authentication, users} from "./authentication"
import {account, accountInfo} from "./account";
import {friend} from "./friend";
import {transactions, asTransactions} from "./transaction";

const rootReducer = combineReducers({
    authentication,
    account,
    accountInfo,
    friend,
    transactions,
    users,
    asTransactions,
})

export default rootReducer