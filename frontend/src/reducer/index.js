import {combineReducers} from "redux"
import {authentication} from "./authentication"
import {account, accountInfo} from "./account";
import {friend} from "./friend";

const rootReducer = combineReducers({
    authentication,
    account,
    accountInfo,
    friend,
})

export default rootReducer