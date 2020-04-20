import React from 'react'
import {Card, Form, Input, Select, Button, Row, Col} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
    caseCauseAdd = values => {
        console.log('Received values of caseCauseAdd form: ', values);
    }

    constructor(){
        super()
        this.state = {infoItems: []}
    }

    componentDidMount(){
        this.setState({
            infoItems : [{id: 1, name: '肇事车辆车型'}, {id: 2, name: '被撞车辆车型'}, {id: 3, name: '财产损失'}, {id: 4, name: '医疗费'}, {id: 5, name: '机动车所有人'}]
        })
    }

    render(){
        return (
            <Card title="新建案由" className="add-card">
                <Form
                    {...layout}
                    name="case_cause_add"
                    onFinish={this.caseCauseAdd}
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
                            <Option value="民事">民事</Option>
                            <Option value="刑事">刑事</Option>
                            <Option value="行政">行政</Option>
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
                    <Form.List name="AddInfoItems">
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                {fields.map((field, index) => (
                                    <Row key={field.key}>
                                        <Col offset = {6} span={4}>
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
                        <Button type="primary" htmlType="submit">
                        确定新建
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}