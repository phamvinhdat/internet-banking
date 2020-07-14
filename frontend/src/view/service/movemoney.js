import {Form, Input, Select, InputNumber, Checkbox, Button} from "antd";
import {accountService} from "../../service/account";
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {transactionAction} from "../../action/transaction"

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

    const accountNumberOnchange = e => {
        const value = e.target.value
        if (value.length < 5) {
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

        props.createTransaction(transaction, value.recipientCharge)
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
            <Item name='bankCode'
                  initialValue='YSB'
                  label='Mã ngân hàng'>
                <Select>
                    <Option value="YSB">YSB - Yasuo bank</Option>
                </Select>
            </Item>
            <Item name='accountNumber'
                  label='Số tài khoản người nhận'
                  rules={[
                      {
                          required: true,
                          message: 'Số tài khoản người nhận không được bỏ trống'
                      }
                  ]}>
                <Input onChange={accountNumberOnchange}
                       allowClear/>
            </Item>
            <Item name='amount'
                  label='Số tiền'
                  initialValue={0}
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
                          validator(_, value) {
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
            <Item name='recipientCharge'
                  valuePropName='checked'
                  label='Người nhận chịu phí'>
                <Checkbox/>
            </Item>
            <Item name='message'
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        createTransaction: (transaction, recipientCharge, saveRecipient) =>
            dispatch(transactionAction.createTransaction(transaction, recipientCharge,
                saveRecipient))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoveMoney)
