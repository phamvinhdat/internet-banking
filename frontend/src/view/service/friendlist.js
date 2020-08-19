import {notiAction} from "../../action/noti";
import {friendAction} from "../../action/friend";
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Table, Button, Modal, Form, Input, InputNumber} from "antd";
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';

const formLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
}

const inputNumberParser = value => value.replace('₫', '')
const inputNumberFormatter = value => `${value}₫`

const FriendList = props => {
    const [visibleUpdatingModal, setVisibleUpdatingModal] = useState(false)
    const [visibleCreateNotiModal, setVisibleCreateNotiModal] = useState(false)
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
                <Button size='small'
                        icon={<EditOutlined/>}
                        onClick={_ => {
                            setCurrentSelectFriend({...friend})
                            setVisibleCreateNotiModal(true)
                        }}
                        style={{margin: '5px'}}>Nhắc nợ</Button>
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

    const onCloseCreateNotiModal = _ => {
        setVisibleCreateNotiModal(false)
    }

    const formSubmit = value => {
        props.updateFriend(currentSelectFriend.accountNumber, value.newName)
        onCloseUpdatingModal()
    }

    const createNotiSubmit = value => {
        props.createNoti({
            account_number: value.account_number,
            type: 'Bị nhắc nợ',
            message: value.message,
            amount: value.amount,
        })
        onCloseCreateNotiModal()
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
        <Modal title='Tạo nhắc nợ'
               closable={false}
               okText='Gửi'
               cancelText='Hủy'
               okButtonProps={{
                   form: 'createNoti',
                   key: 'submit',
                   htmlType: 'submit'
               }}
               onCancel={onCloseCreateNotiModal}
               visible={visibleCreateNotiModal}>
            <Form {...formLayout}
                  onFinish={createNotiSubmit}
                  id='createNoti'>
                <Form.Item name='account_number'
                           label='Số tài khoản'
                           initialValue={currentSelectFriend.accountNumber}
                           rules={[
                               {
                                   required: true,
                                   message: 'Số tài khoản người nhận thông báo không được bỏ trống'
                               }
                           ]}>
                    <Input/>
                </Form.Item>
                <Form.Item name='amount'
                           label='Số tiền'
                           initialValue={10000}
                           rules={[
                               {
                                   required: true,
                                   message: 'Số tiền không được bỏ trống'
                               },
                               {
                                   type: 'number',
                                   message: 'Vui lòng nhập số, không nhập chữ',
                               },
                           ]}>
                    <InputNumber step={1000}
                                 parser={inputNumberParser}
                                 formatter={inputNumberFormatter}
                                 min={1000}
                                 style={{width: '150px'}}/>
                </Form.Item>
                <Form.Item label='Lời nhắn'
                           name='message'>
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
            friendAction.deleteFriend(friendAccountNumber)),
        createNoti: noti => dispatch(notiAction.createNoti(noti))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList)
