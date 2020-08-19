import {userAction} from "../../action/user";
import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Table, Tag} from "antd";

const UserList = props => {

    useEffect(_ => {
        props.getUsers()
    }, [])

    const renderTag = (userID, roleID) => {
        if (roleID === 2) {
            return <Tag closable
                        onClose={_ => props.putStaffRole(userID, 'remove')}
                        color='success'>
                Nhân viên
            </Tag>
        }

        return <Tag color='processing'>
            Người dùng
        </Tag>
    }

    const renderAction = roles => {
        if (roles.length === 1) {
            return <a
                onClick={_ => props.putStaffRole(roles[0].user_id, 'set')}>
                Thêm nhân viên</a>
        }

        return <a onClick={_ => props.putStaffRole(roles[0].user_id, 'remove')}>
            Xóa nhân viên</a>
    }

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
        },
        {
            title: 'Số tài khoản',
            key: 'account_number',
            dataIndex: 'account_number',
        },
        {
            title: 'Chức vụ',
            key: 'roles',
            dataIndex: 'roles',
            render: roles => roles.map(role =>
                renderTag(role.user_id, role.role_id))
        },
        {
            title: 'Chức năng',
            key: 'roles',
            dataIndex: 'roles',
            render: roles => renderAction(roles)
        },
    ]

    const dataSource = props.users.map((user, index) => ({
        key: index,
        id: user.id,
        email: user.email,
        account_number: user.account_number,
        roles: user.roles
    }))

    return <Table dataSource={dataSource}
                  tableLayout='auto'
                  columns={columns}/>
}

const mapStateToProps = state => {
    return {
        users: state.users,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers: _ => dispatch(userAction.getUsers()),
        putStaffRole: (userID, type) => dispatch(
            userAction.putStaffRole(userID, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
