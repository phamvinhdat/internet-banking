import {message} from "antd";
import React from 'react'
import 'antd/dist/antd.css'
import './util/style/index.css'
import Login from './view/login/index'

message.config({
    duration: 3,
    //rtl: true,
});

const App = _ => {
    return (
        <Login/>
    )
}

export default App