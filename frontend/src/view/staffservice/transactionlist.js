import {transactionAction} from "../../action/transaction";
import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Statistic, Table, Tag} from "antd";
import moment from 'moment'

const TransactionList = props => {

    useEffect(_ => {
        props.getTransactions()
    }, [])

    const columns = [
        {
            title: 'Mã giao dịch',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Ngày giao dịch',
            key: 'create_at',
            dataIndex: 'create_at',
        },
        {
            title: 'Loại',
            key: 'type',
            dataIndex: 'type',
            render: type => {
                let color = type === 'Chuyển khoản' ? 'volcano' : 'green'
                return <Tag color={color} key={type}>
                    {type}
                </Tag>
            }
        },
        {
            title: 'Số tiền giao dịch',
            key: 'amount',
            dataIndex: 'amount',
            render: amount => {
                let color = amount < 0 ? '#FF4500' : '#008000'
                return <Statistic
                    valueStyle={{color: `${color}`}}
                    value={Math.abs(amount)}
                    suffix='₫'
                />
            }
        },
        {
            title: 'Mã ngân hàng người gửi',
            key: 'sender_bank_code',
            dataIndex: 'sender_bank_code',
        },
        {
            title: 'Số tài khoản người gửi',
            key: 'sender_account_number',
            dataIndex: 'sender_account_number',
        },
        {
            title: 'Mã ngân hàng người nhận',
            key: 'receiver_bank_code',
            dataIndex: 'receiver_bank_code',
        },
        {
            title: 'Số tài khoản người nhân',
            key: 'receiver_account_number',
            dataIndex: 'receiver_account_number',
        }
    ]

    const dataSource = props.transactions.map((transaction, index) => ({
        key: index,
        id: transaction.id,
        type: transaction.type === 'send' ? 'Chuyển khoản' : 'Nhận chuyển khoản',
        receiver_bank_code: transaction.receiver_bank_code,
        sender_bank_code: transaction.sender_bank_code,
        receiver_account_number: transaction.receiver_account_number === '0'
            ? '-' : transaction.receiver_account_number,
        sender_account_number: transaction.sender_account_number === '0'
            ? '-' : transaction.sender_account_number,
        amount: transaction.amount,
        create_at: moment(transaction.create_at).format('YYYY-MM-DD h:mm:ss a'),
    }))

    return <Table dataSource={dataSource}
                  tableLayout='auto'
                  columns={columns}/>
}

const mapStateToProps = state => {
    return {
        transactions: state.asTransactions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTransactions: _ => dispatch(transactionAction.getAsTransactions()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
