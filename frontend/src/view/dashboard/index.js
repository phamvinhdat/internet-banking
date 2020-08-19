import {
    BankOutlined,
    LogoutOutlined,
    SolutionOutlined,
    WalletOutlined,
    GlobalOutlined,
} from '@ant-design/icons'
import {Badge, Layout, Menu} from "antd";
import {notiAction} from "../../action/noti";
import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {accountAction} from "../../action/account";
import {userAction} from "../../action/user"
import Account from '../account/index'
import Service from "../service/index";
import StaffService from "../staffservice/index";
import NotiList from "../noti/index";

const {Content, Footer, Sider, Header} = Layout;

const WALLET_ITEM = 'wallet'
const SERVICE_ITEM = 'service'
const NOTI_ITEM = 'noti'
const STAFF_SERVICE_ITEM = 'staffservice'
const LOGOUT_ITEM = 'logout'

const staffMenu = authentication => {
    if (!authentication || !authentication.user || !authentication.user.roles) {
        return null
    }

    const role = authentication.user.roles
    const exist = role.find(r => r.id === 2)
    if (exist === undefined) {
        return null
    }

    return <Menu.Item
        key={STAFF_SERVICE_ITEM}
        icon={<SolutionOutlined/>}
        style={{margin: 1}}>
        Quản lý
    </Menu.Item>
}

const Dashboard = props => {
    const [content, setContent] = useState(<Account/>)

    const loopGetNoti = async _ => {
        props.getNotis()
        await new Promise(resolve => setTimeout(resolve, 3000))
        await loopGetNoti()
    }

    useEffect(_ => loopGetNoti(), [])

    const onMenuSelect = obj => {
        const {key} = obj
        switch (key) {
            case WALLET_ITEM:
                setContent(<Account/>)
                break
            case SERVICE_ITEM:
                setContent(<Service/>)
                break
            case STAFF_SERVICE_ITEM:
                setContent(<StaffService/>)
                break
            case NOTI_ITEM:
                setContent(<NotiList/>)
                break
            case LOGOUT_ITEM:
                props.logout()
        }
    }
    return (
        <Layout
            style={{
                height: '100vh',
                background: 'rgba(255, 255, 255, 0.2)',
            }}>
            <Sider
                breakpoint='lg'
                collapsible
                style={{
                    height: '100vh',
                    width: '100%',
                    //position: 'fixed',
                    left: 0,
                }}>
                <Menu theme='dark'
                      onSelect={onMenuSelect}
                      mode='inline'
                      defaultSelectedKeys={[WALLET_ITEM]}
                      style={{
                          height: '100vh',
                          width: '100%',

                      }}>
                    <div style={{height: '63px'}}/>
                    <Menu.Divider/>
                    <Menu.Item
                        key={WALLET_ITEM}
                        icon={<WalletOutlined/>}
                        style={{margin: 1}}>
                        Thông tin tài khoản
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item
                        key={NOTI_ITEM}
                        icon={<GlobalOutlined/>}
                        style={{margin: 1}}>
                        <Badge offset={[20, 0]} count={props.notis.count}>
                            Thông báo</Badge>
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item
                        key={SERVICE_ITEM}
                        icon={<BankOutlined/>}
                        style={{margin: 1}}>
                        Tiện ích
                    </Menu.Item>
                    <Menu.Divider/>
                    {staffMenu(props.authentication)}
                    <Menu.Divider/>
                    <Menu.Item
                        key={LOGOUT_ITEM}
                        icon={<LogoutOutlined/>}
                        style={{margin: 1}}>
                        Đăng xuất
                    </Menu.Item>
                    <Menu.Divider/>
                </Menu>
            </Sider>
            <Layout>
                <Header
                    className='text-center'
                    style={{
                        color: '#fff',
                        fontSize: 20,
                        fontFamily: 'Bungee Shade',
                    }}>
                    Yasuo bank
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        backgroundColor: '#fff',
                    }}>
                    {content}
                </Content>
                <Footer
                    className='text-center'>
                    Yasuo Bank ©2020 Created by 1612091 - 1612234
                </Footer>
            </Layout>
        </Layout>
    )
}

const mapStateToProps = state => {
    return {
        account: state.account,
        authentication: state.authentication,
        notis: state.notis,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: _ => dispatch(userAction.logout()),
        getAccount: _ => dispatch(accountAction.getAccounts()),
        getNotis: _ => dispatch(notiAction.getNotis())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
