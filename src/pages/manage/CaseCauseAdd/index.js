import React from 'react'
import cookie from 'react-cookies'
import { Card, Form, Input, Select, Button, Row, Col, message } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from '../../../axios/index'
import './index.less'

const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
}

export default class CaseCauseAdd extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            infoItems: [],
            caseCause: {}
        }
    }

    componentDidMount = ()=>{
        if(cookie.load('currentUser') == null && cookie.load('currentManager') == null){
            message.warning('请先登录')
            this.props.history.push("/login");
        }else{
            this.getExistedInfoItems()
        }
    }

    getExistedInfoItems = () => {
        axios.ajax({
            url:'/user/getRegisteredInfoItems',
            method:'get'
        }).then((res)=>{
            if(res.resultCode === 0){
                let infoItemList = []
                for(var c of res.resultData){
                    let infoItem = {
                        id: c.id,
                        name: c.name
                    }
                    infoItemList.push(infoItem)
                }
                this.setState({
                    infoItems: infoItemList
                })
            }
        })
    }

    caseCauseAdd = values => {
        console.log('Received values of caseCauseAdd form: ', values);
        let currentUser = cookie.load('currentUser');
        let itemAndCode = {}
        values.addInfoItems.forEach(item => {
            itemAndCode[item.infoItemName] = item.infoItemCode
        })
        let newCaseCause = {
            type: values.caseCauseType,
            coaName: values.caseCauseName,
            userAccount: currentUser.account,
            existedItem: values.infoItems,
            importPackages: values.importPackages,
            itemAndCode: itemAndCode,
        }
        axios.ajax({
            url:'/user/addCauseOfAction',
            method:'post',
            data:newCaseCause,
            headers:{"Content-Type": "application/json"}
        }).then((res)=>{
            if(res.resultCode === 0){
                message.success('案由添加成功')
                this.props.history.push("/manage/caseCauseList");
            }
        })
    }

    caseCauseModify = values => {
        let items = []
        values.addInfoItems.forEach(item => {
            if(item.infoItemId === null){
                items.push({
                    name: item.infoItemName,
                    code: item.infoItemCode,
                    account: this.props.location.state.account,
                    coaId: item.coaId
                })
            }else{
                items.push({
                    id: item.infoItemId,
                    name: item.infoItemName,
                    code: item.infoItemCode,
                    account: this.props.location.state.account,
                    coaId: item.coaId
                })
            }
        })
        let existedItems = values.infoItems.map(item => ({id: parseInt(item)}));
        let modifyCaseCause = {
            coaId: this.props.location.state.id,
            account: this.props.location.state.account,
            type: values.caseCauseType,
            coaName: values.caseCauseName,
            importPackages: values.importPackages,
            items: items,
            existedItems: existedItems
        }
        console.log(modifyCaseCause)
        axios.ajax({
            url:'/user/modifyCauseOfAction',
            method:'post',
            data:modifyCaseCause,
            headers:{"Content-Type": "application/json"}
        }).then((res)=>{
            if(res.resultCode === 0){
                message.success('案由修改成功')
                this.props.history.push("/manage/caseCauseList");
            }
        })
    }

    toCaseCauseList = () => {
        this.props.history.push("/manage/caseCauseList") 
    }

    render(){
        let caseCause = this.props.location.state ? this.props.location.state : {}
        return (
            <Card title="新建案由" className="add-card">
                <Form
                    {...layout}
                    name="case_cause_add"
                    onFinish={this.props.location.state?this.caseCauseModify:this.caseCauseAdd}
                    initialValues = {{
                        caseCauseName : caseCause.name,
                        caseCauseType : caseCause.type,
                        infoItems : caseCause.infoItems?caseCause.infoItems.map(item => ''+item.id):[],
                        importPackages: caseCause.importPackages,
                        addInfoItems : caseCause.ownInfoItems?caseCause.ownInfoItems.map(item => {return ({infoItemId:item.id,infoItemName:item.name,infoItemCode:item.code})}):[]
                    }}
                >
                    <Form.Item
                        label="案由名称"
                        name="caseCauseName"
                        rules={[{ required: true, message: '案由名称不能为空' }]}
                    >
                        <Input style={{ width: 300 }}/>
                    </Form.Item>
                    <Form.Item
                        label="类别"
                        name="caseCauseType"
                        rules={[{ required: true, message: '类别不能为空' }]}
                    >
                        <Select
                            allowClear
                            style={{ width: 300 }}
                        >
                            <Option value="CIVIL">民事</Option>
                            <Option value="CRIMINAL">刑事</Option>
                            <Option value="ADMINISTRATIVE">行政</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="已有信息项"
                        name="infoItems"
                    >
                        <Select
                            mode="multiple"
                            style={{ width: 500 }}
                        >
                            {this.state.infoItems.map(item => <Option key = {item.id}>{item.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="所需import语句"
                        name="importPackages"
                    >
                        <Input.TextArea 
                            allowClear 
                            style = {{width: 500}} 
                            className = "info-item-code-textarea"/>
                    </Form.Item>
                    <Form.List name="addInfoItems">
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                {fields.map((field, index) => (
                                    <Row key={field.key}>
                                        <Col offset = {6} span={4}>
                                            <Form.Item
                                                name={[field.name, "infoItemId"]}
                                                fieldKey={[field.fieldKey, "infoItemId"]}
                                                style={{display: 'none'}}
                                            >
                                                <Input/>
                                            </Form.Item>
                                            <Form.Item
                                                name={[field.name, "infoItemName"]}
                                                fieldKey={[field.fieldKey, "infoItemName"]}
                                                rules={[{ required: true, message: '信息项名称不能为空' }]}
                                            >
                                                <Input placeholder="信息项名称" style = {{width: 145}}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={13}>
                                            <Form.Item
                                                name={[field.name, "infoItemCode"]}
                                                fieldKey={[field.fieldKey, "infoItemCode"]}
                                                rules={[{ required: true, message: '信息项代码不能为空' }]}
                                            >
                                                <Input.TextArea 
                                                    allowClear 
                                                    placeholder = "信息项对应代码" 
                                                    style = {{width: 480}} 
                                                    className = "info-item-code-textarea"/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}>
                                            <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => {
                                                remove(field.name);
                                            }}
                                            />
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item {...tailLayout}>
                                    <Button
                                    type="dashed"
                                    onClick={() => {
                                        add();
                                    }}
                                    style={{ width: 500 }}
                                    >
                                    <PlusOutlined /> 新增信息项
                                    </Button>
                                </Form.Item>
                                </div>
                            );
                        }}
                    </Form.List>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" className = "case-cause-add-btn">
                        {this.props.location.state?'确认修改':'确定新建'}
                        </Button>
                        <Button htmlType="button" onClick={this.toCaseCauseList}>
                            返回
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}