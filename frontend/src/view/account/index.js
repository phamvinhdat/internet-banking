import {Row, Card, Statistic, Col, Popover, Button, Tooltip} from "antd";
import CreateSavingAccount from "./createsavingaccount";
import React, {useEffect, useState} from 'react'
import {connect} from "react-redux";
import {accountAction} from '../../action/account'
import {PlusOutlined} from '@ant-design/icons'
import PopoverSavingAccount from "./popoversavingaccount";

const style = {
    grid: {
        width: '250px',
        height: '150px',
        padding: '10px'
    },
    addBtn: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBtn: {
        fontSize: '50px',
    },
    card: {
        minHeight: '260px',
        minWidth: '300px'
    }
}

const Account = props => {
    const [createSAVisible, setCreateSAVisible] = useState(false)

    const createSAOnClose = _ => {
        setCreateSAVisible(false)
    }

    const createSAShow = _ => {
        setCreateSAVisible(true)
    }

    useEffect(() => {
        props.getAccounts()
    }, [])

    const {account} = props

    const savingAccountCards = (savingAccount = []) => {

        return <Card title='Tài khoản tiết kiệm'
                     style={style.card}
                     hoverable>
            {savingAccount.map((account) => (
                <Popover content={
                    <PopoverSavingAccount savingAccountID={account.id}/>}
                         key={account.id}
                         trigger='hover'>
                    <Card.Grid style={style.grid}
                               hoverable>
                        <Statistic
                            title='Tên'
                            groupSeparator=''
                            value={account.name}
                        />
                        <Statistic
                            title='Số dư'
                            valueStyle={{color: '#3f8600'}}
                            value={account.balance}
                            suffix='₫'
                        />
                    </Card.Grid>
                </Popover>
            ))}
            <Card.Grid style={style.grid}>
                <Tooltip title='Thêm tài khoản tiết kiệm'>
                    <Button style={style.addBtn}
                            onClick={createSAShow}
                            icon={<PlusOutlined style={style.iconBtn}/>}/>
                </Tooltip>
            </Card.Grid>
        </Card>
    }

    return (
        <Row justify='center'
             gutter={[16, 16]}
             style={{
                 width: '100%'
             }}>
            <Col>
                <Card title='Tài khoản thanh toán'
                      style={style.card}
                      hoverable>
                    <Statistic
                        title='Số tài khoản'
                        groupSeparator=''
                        value={account.account_number}
                    />
                    <Statistic
                        title='Số dư'
                        valueStyle={{color: '#3f8600'}}
                        value={account.balance}
                        suffix='₫'
                    />
                </Card>
            </Col>
            <Col>
                {savingAccountCards(account.saving_account)}
            </Col>
            <CreateSavingAccount visible={createSAVisible}
                                 onClose={createSAOnClose}/>
        </Row>
    )
}

const mapStateToProps = state => {
    return {
        account: state.account
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAccounts: _ => dispatch(accountAction.getAccounts())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)
