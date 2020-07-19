import {friendAction} from "../../action/friend";
import React from 'react'
import {connect} from 'react-redux'
import {Table, Button} from "antd";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';

const FriendList = props => {

    const columns = [
        {
            title: '#',
            key: 'index',
            dataIndex: 'index',
        },
        {
            title: 'Tên',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Ngân hàng',
            key: 'bank',
            dataIndex: 'bank',
        },
        {
            title: 'Số tài khoản',
            key: 'accountNumber',
            dataIndex: 'accountNumber',
        },
        {
            key: 'action',
            render: friend => <div>
                <Button danger
                        size='small'
                        style={{margin: '5px'}}
                        onClick={_ => {
                            props.deleteFriend(friend.accountNumber)
                        }}
                        icon={<DeleteOutlined/>}>Xóa</Button>
                <Button type='primary'
                        size='small'
                        icon={<EditOutlined/>}
                        style={{margin: '5px'}}>Cập nhật</Button>
            </div>
        }
    ]

    const dataSource = props.friend.map((friend, index) => ({
        key: index,
        index: index,
        name: friend.friend_name,
        bank: friend.bank_code,
        accountNumber: friend.friend_account_number,
    }))

    return <Table dataSource={dataSource}
                  tableLayout='auto'
        //bordered
                  columns={columns}/>
}

const mapStateToProps = state => {
    return {
        friend: state.friend,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFriend: _ => dispatch(friendAction.getFriend()),
        deleteFriend: friendAccountNumber => dispatch(
            friendAction.deleteFriend(friendAccountNumber))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
