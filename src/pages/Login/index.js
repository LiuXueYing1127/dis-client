import React from 'react'
import cookie from 'react-cookies'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from '../../axios/index'
import './index.less'

export default class Login extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            register: false
        }
    }

    componentDidMount(){
        this.logoutOrRegister()
        if(cookie.load('currentUser') != null || cookie.load('currentManager') != null){
            this.props.history.push("/manage");
        }
    }

    componentDidUpdate (prevProps) {
        let oldLocation = prevProps.location;
        let newLocation = this.props.location;
        if (newLocation !== oldLocation) this.logoutOrRegister();
    }

    logoutOrRegister = ()=>{
        const query_params = new URLSearchParams(this.props.location.search)
        const logout = query_params.get('logout')
        if(logout === 'true'){
            cookie.remove('currentUser', { path: '/' })
            cookie.remove('currentManager', { path: '/' })
        }
        const register = query_params.get('register')
        if(register === 'true'){
            this.setState({
                register: true
            })
        }else{
            this.setState({
                register: false
            })
        }
    }

    login = (values) => {
        axios.ajax({
            url:'/user/login',
            method:'get',
            data:{
                params:{
                    username:values.login_username,
                    password:values.login_password
                }
            }
        }).then((res)=>{
            // eslint-disable-next-line
            if(res.resultCode === 0){
                message.success(`登录成功`)
                let type = res.resultData.type
                if(type === 'Ordinary'){
                    cookie.save('currentUser', res.resultData, { path: '/' })
                }else if(type === 'Manager'){
                    cookie.save('currentManager', res.resultData, { path: '/' })
                }
                this.props.history.push("/manage")
            }else if(res.resultCode === 1){
                message.warning(res.resultMessage)
            }
        })
    }

    register = (values) => {
        console.log(values)
        axios.ajax({
            url:'/user/register',
            method:'get',
            data:{
                params:{
                    username:values.register_username,
                    password:values.register_password
                }
            }
        }).then((res)=>{
            // eslint-disable-next-line
            if(res.resultCode === 0){
                message.success(`注册成功`)
            }
        })
    }

    render(){
        return (
            <div style = {{ overflow: 'hidden'}}>
                <div className = "login-background"></div>
                {this.state.register === false ? 
                <div className = "login-form-container">
                    <Form
                        name="login"
                        onFinish={this.login}
                    >
                        <Form.Item
                            name="login_username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="login_password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                            </Button>
                            <span style={{color: 'white'}}>Or</span>
                            <a href="/#/login?register=true" className = 'login-form-a'> register now!</a>
                        </Form.Item>
                    </Form>
                </div>
                :
                <div className = "register-form-container">
                    <Form
                        name="register"
                        onFinish={this.register}
                    >
                        <Form.Item
                            name="register_username"
                            rules={[{ required: true, message: 'Please input your Username!' }]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="register_password"
                            rules={[{ required: true, message: 'Please input your Password!' }]}
                        >
                            <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="register_confirm"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                if (!value || getFieldValue('register_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords you entered do not match!');
                                },
                            }),
                            ]}
                        >
                            <Input.Password 
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Confirm Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            Register
                            </Button>
                            <span style={{color: 'white'}}>Or</span>
                            <a href="/#/login" className = 'login-form-a'> log in now!</a>
                        </Form.Item>
                    </Form>
                </div>
                }
            </div>
        )
    }
}