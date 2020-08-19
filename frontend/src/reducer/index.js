import {combineReducers} from "redux"
import {authentication, users} from "./authentication"
import {account, accountInfo} from "./account";
import {friend} from "./friend";
import {transactions, asTransactions} from "./transaction";
import {notis} from "./noti";

const rootReducer = combineReducers({
    authentication,
    account,
    accountInfo,
    friend,
    transactions,
    users,
    asTransactions,
    notis,
})

export default rootReducer
