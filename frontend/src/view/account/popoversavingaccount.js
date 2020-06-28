import {accountAction} from "../../action/account";
import React from 'react'
import {Button} from "antd"
import {connect} from 'react-redux'
import {DeleteOutlined, EditOutlined} from '@ant-design/icons'

const PopoverSavingAccount = props => {

    const onBtnDeleteClick = _ => {
        props.del(props.savingAccountID)
    }

    return <div>
        <Button type='primary'
                icon={<DeleteOutlined/>}
                onClick={onBtnDeleteClick}
                style={{
                    margin: '0px 5px'
                }}
                danger>Xóa</Button>
        <Button type='primary'
                icon={<EditOutlined/>}
                style={{
                    margin: '0px 5px'
                }}>Cập nhật</Button>
    </div>
}

const mapDispatchToProps = dispatch => {
    return {
        del: savingAccountID =>
            dispatch(accountAction.delSavingAccount(savingAccountID)),
        update: (savingAccountID, name, delBalance) =>
            dispatch(accountAction.updateSavingAccount(savingAccountID, name, delBalance))
    }
}

export default connect(null, mapDispatchToProps)(PopoverSavingAccount)
