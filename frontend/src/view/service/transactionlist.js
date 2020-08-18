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
            title: 'Mã ngân hàng đối tác',
            key: 'bank_code',
            dataIndex: 'bank_code',
        },
        {
            title: 'Số tài khoản đối tác',
            key: 'account_number',
            dataIndex: 'account_number',
        },
        {
            title: 'Lời nhắn',
            key: 'message',
            dataIndex: 'message',
        }
    ]

    const dataSource = props.transactions.map((transaction, index) => ({
        key: index,
        id: transaction.id,
        type: transaction.type === 'send' ? 'Chuyển khoản' : 'Nhận chuyển khoản',
        bank_code: transaction.type === 'send' ? transaction.receiver_bank_code
            : transaction.sender_bank_code,
        account_number: transaction.type === 'send'
            ? transaction.receiver_account_number
            : transaction.sender_account_number,
        message: transaction.message,
        amount: transaction.type === 'send'
            ? -transaction.amount
            : transaction.amount,
        create_at: moment(transaction.create_at).format('YYYY-MM-DD h:mm:ss a'),
    }))

    return <Table dataSource={dataSource}
                  tableLayout='auto'
                  columns={columns}/>
}

const mapStateToProps = state => {
    return {
        transactions: state.transactions,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTransactions: _ => dispatch(transactionAction.getTransactions()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)
