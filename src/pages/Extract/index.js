import React from 'react'
import { Layout, Card, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import HeaderCom from '../components/Header'
import './index.less'

const { Dragger } = Upload;
const {Header, Content} = Layout

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
    },
};

export default class Extract extends React.Component {
    render(){
        return (
            <div>
                <Layout>
                    <Header className = 'extract-header'>
                        <div className = "extract-header-com"><HeaderCom/></div>
                    </Header>
                    <Content className = 'extract-content'>
                        <div className = 'extract-background'></div>
                        <Card title="要素抽取" className="list-card">
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">点击或拖拽文件上传</p>
                            </Dragger>
                        </Card>
                    </Content>
                </Layout>
            </div>
        )
    }
}