import TransactionList from "./transactionlist";
import React from 'react'
import {Tabs} from "antd"
import {SendOutlined, SaveOutlined, HistoryOutlined} from '@ant-design/icons'
import MoveMoney from "./movemoney"
import FriendList from "./friendlist";

const {TabPane} = Tabs
const MOVE_MONEY = 'MOVE_MONEY'
const MOVE_MONEY_LIST = 'MOVE_MONEY_LIST'
const TRANSACTION_LIST = 'TRANSACTION_LIST'

const Service = _ => {

    return (
        <Tabs animated
              style={{
                  margin: '10px'
              }}>
            <TabPane tab={<span>Chuyển khoản <SendOutlined/></span>}
                     key={MOVE_MONEY}>
                <MoveMoney/>
            </TabPane>
            <TabPane tab={<span>Danh sách gợi nhớ <SaveOutlined/></span>}
                     key={MOVE_MONEY_LIST}>
                <FriendList/>
            </TabPane>
            <TabPane tab={<span>Lịch sử giao dịch <HistoryOutlined/></span>}
                     key={TRANSACTION_LIST}>
                <TransactionList/>
            </TabPane>
        </Tabs>
    )
}

export default Service
