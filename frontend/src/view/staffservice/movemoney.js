import {
    Form,
    Input,
    AutoComplete,
    Select,
    InputNumber,
    Checkbox,
    Button
} from "antd";
import {accountService} from "../../service/account";
import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {transactionAction} from "../../action/transaction"
import {friendAction} from "../../action/friend";

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
}

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
}

const {Item} = Form
const {Option} = Select
const inputNumberParser = value => value.replace('₫', '')
const inputNumberFormatter = value => `${value}₫`

const MoveMoney = props => {
    const [form] = Form.useForm()
    const [isValid, setIsValid] = useState(false)
    let delayTimer

    useEffect(_ => {
        props.getFriend()
    }, [])

    const accountNumberOnchange = value => {
        if (!value || value.length < 5) {
            return
        }

        clearTimeout(delayTimer)
        delayTimer = setTimeout(_ => {
            accountService.getAccountInfo(value)
                .then(res => {
                    const userInfo = res.data
                    form.setFieldsValue({
                        name: userInfo.name,
                    })
                    setIsValid(true)
                })
                .catch(_ => {
                    form.setFieldsValue({
                        name: '',
                    })
                    setIsValid(false)
                })
        }, 500)
    }

    const onFinish = value => {
        const transaction = {
            receiver_account_number: value.accountNumber,
            receiver_bank_code: value.bankCode,
            sender_account_number: props.account.account_number,
            sender_bank_code: 'YSB',
            amount: value.amount,
            message: value.message
        }

        props.createTransaction(transaction, value.recipientCharge,
            value.saveRecipient)

        form.resetFields()
        setIsValid(false)
    }

    const accountNumberOption = props.friend.map(friend => ({
        value: friend.friend_account_number,
        label: `${friend.friend_account_number} - ${friend.bank_code} - ${friend.friend_name}`,
        original: friend,
    }))

    const accountNumberOnSelect = (_, option) => {
        form.setFieldsValue({
            name: option.original.friend_name,
            bankCode: option.original.bank_code,
        })
        setIsValid(true)
    }

    return (
        <Form form={form}
              scrollToFirstError={true}
              onFinish={onFinish}
              {...formItemLayout}>
            <Item name='name'
                  initialValue={props.accountInfo.name}
                  label='Tên người nhận'>
                <Input disabled/>
            </Item>
            <Item name='accountNumber'
                  label='Số tài khoản người nhận'
                  rules={[
                      {
                          required: true,
                          message: 'Số tài khoản người nhận không được bỏ trống'
                      }
                  ]}>
                <AutoComplete onChange={accountNumberOnchange}
                    //onSearch={}
                              onSelect={accountNumberOnSelect}
                              options={accountNumberOption}
                              allowClear>
                    <Input/>
                </AutoComplete>
            </Item>
            <Item name='amount'
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
                      {
                          validator: (_, value) => {
                              if (value >= 10000) {
                                  return Promise.resolve()
                              }

                              return Promise.reject('Số tiền chuyển khoản phải lớn hơn 10 000₫')
                          }
                      }
                  ]}>
                <InputNumber step={10000}
                             parser={inputNumberParser}
                             formatter={inputNumberFormatter}
                             max={props.account.balance}
                             min={10000}
                             style={{width: '150px'}}/>
            </Item>
            <Item name='message'
                  initialValue=''
                  label='Lời nhắn'>
                <Input allowClear
                       placeholder='Gửi lời nhắn đến người nhận (không bắt buôc)'/>
            </Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary"
                        disabled={!isValid}
                        htmlType="submit">
                    Gửi
                </Button>
            </Form.Item>
        </Form>
    )
}

const mapStateToProps = state => {
    return {
        account: state.account,
        accountInfo: state.accountInfo,
        friend: state.friend,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createTransaction: (transaction, recipientCharge, saveRecipient) =>
            dispatch(transactionAction.createTransaction(transaction, recipientCharge,
                saveRecipient)),
        getFriend: _ => dispatch(friendAction.getFriend())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoveMoney)
