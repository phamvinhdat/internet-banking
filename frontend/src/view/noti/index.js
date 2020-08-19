import {notiAction} from "../../action/noti";
import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Statistic, Table} from "antd";

const NotiList = props => {

    useEffect(_ => {
        props.getNotis()
    }, [])

    const columns = [
        {
            title: '#',
            key: 'key',
            dataIndex: 'key',
        },
        {
            title: 'Loại thông báo',
            key: 'type',
            dataIndex: 'type',
        },
        {
            title: 'Số tiền',
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
            title: 'Tin nhắn',
            key: 'message',
            dataIndex: 'message',
        },
    ]

    const dataSource = props.notis.data.map((noti, index) => ({
        key: index,
        type: noti.type,
        message: noti.message.length > 0 ? noti.message : '-',
        amount: noti.amount,
    }))

    return <Table dataSource={dataSource}
                  tableLayout='auto'
                  columns={columns}/>
}

const mapStateToProps = state => {
    return {
        notis: state.notis,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getNotis: _ => dispatch(notiAction.getNotis()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotiList)
