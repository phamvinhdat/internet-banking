import {Form, Input, Select, InputNumber, Checkbox, Button} from "antd";
import React, {useState} from 'react'
import {connect} from 'react-redux'

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

    return (
        <Form form={form}
              {...formItemLayout}>
            <Item name='name'
                  label='Tên người nhận'>
                <Input disabled/>
            </Item>
            <Item name='bankCode'
                  label='Mã ngân hàng'>
                <Select defaultValue='YSB'>
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
                <Input/>
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
                  ]}>
                <InputNumber step={10000}
                             parser={inputNumberParser}
                             formatter={inputNumberFormatter}
                             max={props.account.balance}
                             min={10000}
                             style={{width: '150px'}}/>
            </Item>
            <Item name='recipientCharge'
                  label='Người nhận chịu phí'>
                <Checkbox/>
            </Item>
            <Item name='message'
                  label='Lời nhắn'>
                <Input
                    placeholder='Gửi lời nhắn đến người nhận (không bắt buôc)'/>
            </Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary"
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
    }
}

export default connect(mapStateToProps)(MoveMoney)
