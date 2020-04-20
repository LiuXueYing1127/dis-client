import React from 'react'
import cookie from 'react-cookies'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from '../../axios/index'
import './index.less'

export default class Login extends React.Component{
    login = (values) => {
        axios.ajax({
            url:'/user/login',
            method:'get',
            data:{
                params:{
                    username:values.username,
                    password:values.password
                }
            }
        }).then((res)=>{
            // eslint-disable-next-line
            if(res.resultCode === 0){
                message.success(`登录成功`)
                //页面跳转
                this.props.history.push("/manage")
                cookie.save('currentUser', res.resultData, { path: '/' })
            }else if(res.resultCode === 1){
                message.warning(res.resultMessage)
            }
        })
    }

    render(){
        return (
            <div style = {{ overflow: 'hidden'}}>
                <div className = "login-background"></div>
                <div className = "login-form-container">
                    <Form
                        name="normal_login"
                        onFinish={this.login}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}