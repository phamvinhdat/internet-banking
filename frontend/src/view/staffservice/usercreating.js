import {Button, Form, Input} from "antd";
import {userAction} from "../../action/user"
import {connect} from 'react-redux'
import React from 'react'

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

const {Item} = Form

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


const UserCreating = props => {
    const [form] = Form.useForm()

    const onFinish = value => {
        props.register(value)
        form.resetFields()
    }

    return (
        <Form scrollToFirstError={true}
              onFinish={onFinish}
              {...formItemLayout}
              form={form}>
            <Item name='name'
                  hasFeedback
                  label='Tên khách hàng'
                  rules={[
                      {
                          required: true,
                          message: "Tên người dùng không được bỏ trống"
                      },
                  ]}>
                <Input/>
            </Item>
            <Item name='email'
                  label='Địa chỉ email'
                  hasFeedback
                  rules={[
                      {
                          required: true,
                          message: 'Vui lòng nhập tên đăng nhập!'
                      },
                      {
                          type: "email",
                          message: 'Tên đăng nhập phải là email!'
                      }
                  ]}>
                <Input/>
            </Item>
            <Form.Item
                label='Mật khẩu'
                name='password'
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu!'
                    },
                    {
                        min: 6,
                        message: 'Mật khẩu dài ít nhất 6 kí tự!'
                    }
                ]}>
                <Input.Password/>
            </Form.Item>
            <Form.Item
                label='Xác nhận lại mật khẩu'
                name='confirm'
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập lại mật khẩu!'
                    },
                    ({getFieldValue}) => ({
                        validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject('Mật khẩu bạn nhập lại không chính xác');
                        },
                    }),
                ]}>
                <Input.Password/>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary"
                        htmlType="submit">
                    Gửi
                </Button>
            </Form.Item>
        </Form>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        register: user => dispatch(userAction.register(user))
    }
}

export default connect(null, mapDispatchToProps)(UserCreating)
