import {combineReducers} from "redux"
import {authentication} from "./authentication"
import {account, accountInfo} from "./account";

const rootReducer = combineReducers({
    authentication,
    account,
    accountInfo,
})

export default rootReducer