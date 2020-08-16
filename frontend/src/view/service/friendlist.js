import {friendAction} from "../../action/friend";
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Table, Button, Modal, Form, Input} from "antd";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';

const formLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
}

const FriendList = props => {
    const [visibleUpdatingModal, setVisibleUpdatingModal] = useState(false)
    const [currentSelectFriend, setCurrentSelectFriend] = useState({
        name: "",
        accountNumber: 0,
    })

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
                        onClick={_ => {
                            setCurrentSelectFriend({...friend})
                            setVisibleUpdatingModal(true)
                        }}
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

    const onCloseUpdatingModal = _ => {
        setVisibleUpdatingModal(false)
    }

    const formSubmit = value => {
        props.updateFriend(currentSelectFriend.accountNumber, value.newName)
        onCloseUpdatingModal()
    }

    return <div>
        <Table dataSource={dataSource}
               tableLayout='auto'
               columns={columns}/>
        <Modal title='Cập nhật bạn'
               closable={false}
               okText='Lưu'
               cancelText='Hủy'
               okButtonProps={{
                   form: 'updateFriendForm',
                   key: 'submit',
                   htmlType: 'submit'
               }}
               onCancel={onCloseUpdatingModal}
               visible={visibleUpdatingModal}>
            <Form {...formLayout}
                  onFinish={formSubmit}
                  id='updateFriendForm'>
                <Form.Item
                    label="Tên gợi nhớ"
                    name="newName"
                    initialValue={currentSelectFriend.name}
                    rules={[{
                        required: true,
                        message: 'Tên người dùng không được bỏ trống',
                    }]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    </div>
}

const mapStateToProps = state => {
    return {
        friend: state.friend,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFriend: _ => dispatch(friendAction.getFriend()),
            updateFriend: (friendAccountNumber, newFriendName) => dispatch(
            friendAction.updateFriend(friendAccountNumber, newFriendName)),
        deleteFriend: friendAccountNumber => dispatch(
            friendAction.deleteFriend(friendAccountNumber))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
