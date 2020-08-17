import {Button, Form, Input} from "antd";
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {userAction} from '../../action/user'
import ReCAPTCHA from "react-google-recaptcha"
import config from "../../config"

const layout = {
    labelCol: {span: 9},
    wrapperCol: {span: 15},
}

const LoginTab = props => {
    const [human, setHuman] = useState(false)
    const [captchaKey, setCaptchaKey] = useState('')
    let captcha

    const onFinish = value => {
        props.login(value, captchaKey)
        captcha.reset()
        setHuman(false)
    }

    const setCaptchaRef = (ref) => {
        if (ref) {
            return captcha = ref;
        }
    };

    const verifyCaptcha = value => {
        if (value) {
            setCaptchaKey(value)
            setHuman(true)
        }
    }

    const expireCaptcha = () => {
        setCaptchaKey('')
        setHuman(false)
    }

    return (
        <Form {...layout}
              scrollToFirstError={true}
              onFinish={onFinish}
        >
            <Form.Item
                label='Tên đăng nhập'
                name='username'
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập tên đăng nhập!'
                    },
                    {
                        type: "email",
                        message: 'Tên đăng nhập phải là email!'
                    }
                ]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label='Mật khẩu'
                name='password'
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu!'
                    },
                    {
                        min: 6,
                        message: 'Mật khẩu dài ít nhất 6 kí tự!'
                    }
                ]}
            >
                <Input.Password/>
            </Form.Item>

            <div style={{
                marginBottom: '10px',
                marginLeft: '20px'
            }}>
                <ReCAPTCHA onChange={verifyCaptcha}
                           ref={(r) => setCaptchaRef(r)}
                           onExpired={expireCaptcha}
                           sitekey={config.CAPTCHA_SITE_KEY}/>
            </div>

            <Form.Item wrapperCol={{...layout.wrapperCol, offset: 9}}>
                <Button type='primary'
                        disabled={!human}
                        htmlType='submit'>Submit</Button>
            </Form.Item>
        </Form>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        login: (user, captchaKey) => dispatch(userAction.login(user.username, user.password, captchaKey))
    }
}

export default connect(null, mapDispatchToProps)(LoginTab)
