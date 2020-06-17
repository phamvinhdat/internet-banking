import {userAction} from "../../action/user";
import React from 'react'
import {connect} from "react-redux";
import {Col, Layout, Menu, Row} from 'antd'
import {UserOutlined, LogoutOutlined} from '@ant-design/icons';

const Header = props => {

    return (
        <Layout.Header>
            <Row>
                <Col offset={22}>
                    <Menu theme='dark' mode='horizontal'>
                        <Menu.SubMenu icon={<UserOutlined/>} title={'datcay='}>
                            <Menu.Item key={1}
                                       icon={<LogoutOutlined/>}
                                       onClick={props.logout}>
                                Đăng xuất
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Col>
            </Row>
        </Layout.Header>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        logout: _ => dispatch(userAction.logout())
    }
}

export default connect(null, mapDispatchToProps)(Header)
