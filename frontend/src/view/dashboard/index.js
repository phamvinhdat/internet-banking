import Header from "./header";
import React, {useState} from 'react'
import {Layout, Menu} from "antd";
import {
    WalletOutlined
} from '@ant-design/icons';

const {Content, Footer, Sider} = Layout;

const WALLET_ITEM = 'wallet'
const ACCOUNT_ITEM = 'account'

const Dashboard = props => {

    const [content, setContent] = useState('132')
    const onMenuSelect = obj => {
        const {key} = obj
        switch (key) {
            case WALLET_ITEM:
                setContent(132)
                break
            case  ACCOUNT_ITEM:
                setContent(125)
        }
    }

    return (
        <Layout
            style={{
                height: '100vh',
                background: 'rgba(255, 255, 255, 0.2)'
            }}>
            <Sider
                collapsible>
                <Menu theme='dark'
                      onSelect={onMenuSelect}
                      mode='inline'
                      defaultSelectedKeys={[ACCOUNT_ITEM]}>
                    <div style={{height: '63px'}}/>
                    <Menu.Divider/>
                    <Menu.Item
                        key={ACCOUNT_ITEM}
                        icon={<WalletOutlined/>}
                        style={{margin: 1}}>
                        Thông tin tài khoản
                    </Menu.Item>
                    <Menu.Divider/>
                    <Menu.Item
                        key={WALLET_ITEM}
                        icon={<WalletOutlined/>}
                        style={{margin: 1}}>
                        Thông tin tài khoản
                    </Menu.Item>
                    <Menu.Divider/>
                </Menu>
            </Sider>
            <Layout>
                <Layout.Header
                    className='text-center'
                    style={{
                        color: '#fff',
                        fontSize: 20,
                        fontFamily: 'Bungee Shade',
                    }}>
                    Yasuo bank
                </Layout.Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        backgroundColor: '#fff'
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

export default Dashboard
