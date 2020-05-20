import React from 'react'
import cookie from 'react-cookies'
import { Layout, Card, Upload, message, Button, Collapse, Divider } from 'antd'
import { InboxOutlined, DownloadOutlined } from '@ant-design/icons';
import HeaderCom from '../components/Header'
import axios from '../../axios/index'
import './index.less'

const { Dragger } = Upload;
const { Header, Content } = Layout
const { Panel } = Collapse;

export default class Extract extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            resultList: [],
            fileList: [],
            uploading: false,
        }
    }

    componentDidMount = ()=>{
        if(cookie.load('currentUser')==null && cookie.load('currentManager')==null){
            message.warning('请先登录')
            this.props.history.push("/login");
        }
    }

    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('files', file);
        });
    
        this.setState({
          uploading: true,
        });

        axios.ajax({
            url:'/user/extract',
            method:'post',
            data:formData,
            headers:{"Content-Type": "multipart/form-data"}
        }).then((res)=>{
            if(res.resultCode === 0){
                this.setState({
                    fileList: [],
                    uploading: false,
                });
                message.success('信息抽取成功')
            }else{
                this.setState({
                    uploading: false,
                });
            }
        })
    }

    render(){
        const { uploading, fileList } = this.state;
        const props = {
            multiple: true,
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                const isXML = file.type === 'text/xml';
                if (!isXML) {
                    message.error('请上传xml格式的文件！');
                }else{
                    this.setState(state => ({
                        fileList: [...state.fileList, file],
                    }));
                }
                return false;
            },
            fileList,
        };
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
                            <Button type="primary" block className = "extract-submit-button" 
                                disabled={fileList.length === 0}
                                loading={uploading}
                                onClick={this.handleUpload}>
                                {uploading ? '正在提交中' : '提交抽取'}
                            </Button>
                            {this.state.resultList.length > 0 ? (
                                <div>
                                    <Divider orientation="left">抽取结果</Divider>
                                    <Collapse defaultActiveKey={['0']}>
                                    {
                                        this.state.resultList.map((re, index) => (
                                            <Panel 
                                                header={re.filename} 
                                                extra={<Button shape="round" icon={<DownloadOutlined />} style={{margin: '-5px 0 -5px'}}>下载到本地</Button>} 
                                                style={{ width: '100%' }}
                                                key={(index)+''}>
                                                <div>{re.text}</div>
                                            </Panel>
                                        ))
                                    }
                                    </Collapse>
                                </div>
                            ) : ''}
                        </Card>
                    </Content>
                </Layout>
            </div>
        )
    }
}