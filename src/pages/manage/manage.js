import React from 'react'
import { Layout } from 'antd'
import HeaderCom from '../components/Header'
import './manage.less'

const {Header, Content} = Layout

export default class Manage extends React.Component {
    render(){
        return (
            <div>
                <Layout>
                    <Header className = 'manage-header'>
                        <div className = "manage-header-com"><HeaderCom/></div>
                    </Header>
                    <Content className = 'manage-content'>
                        <div className = 'manage-background'></div>
                        {this.props.children}
                    </Content>
                </Layout>
            </div>
        )
    }
}