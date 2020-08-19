import React from 'react'
import {Tabs} from "antd"
import {
    UserAddOutlined,
    MoneyCollectOutlined,
    RiseOutlined
} from '@ant-design/icons'
import UserCreating from "./usercreating";
import MoveMoney from "./movemoney";
import UserList from "./userlist";
import {connect} from 'react-redux'

const {TabPane} = Tabs
const MOVE_MONEY = 'MOVE_MONEY'
const MOVE_MONEY_LIST = 'MOVE_MONEY_LIST'
const USER_LIST = 'USER_LIST'

const adminItem = authentication => {
    if (!authentication || !authentication.user || !authentication.user.roles) {
        return null
    }

    const role = authentication.user.roles
    const exist = role.find(r => r.id === 3)
    if (exist === undefined) {
        return null
    }

    return <TabPane key={USER_LIST}
                    tab={<span>Quản lí nhân viên <RiseOutlined/></span>}>
        <UserList/>
    </TabPane>
}

const StaffService = props => {

    return (
        <Tabs animated
              style={{
                  margin: '10px'
              }}>
            <TabPane tab={<span>Tạo tài khoản <UserAddOutlined/></span>}
                     key={MOVE_MONEY}>
                <UserCreating/>
            </TabPane>
            <TabPane tab={
                <span>Nạp tiền vào tài khoản <MoneyCollectOutlined/></span>}
                     key={MOVE_MONEY_LIST}>
                <MoveMoney/>
            </TabPane>
            {adminItem(props.authentication)}
        </Tabs>
    )
}

const mapStateToProps = state => {
    return {
        authentication: state.authentication,
    }
}

export default connect(mapStateToProps)(StaffService)
