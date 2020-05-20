import React from 'react'
import cookie from 'react-cookies'
import { Card, Row, Col, Tag, Table, Button, message } from 'antd'
import axios from '../../../axios/index'
import './index.less'

export default class CaseCauseReview extends React.Component {

    caseCauseEdit = (caseCause) => {
        this.props.history.push({pathname:"/manage/caseCauseAdd", state:caseCause})
    }

    caseCausePass = (caseCause) => {
        axios.ajax({
            url:'/manager/passCauseOfAction',
            method:'get',
            data:{
                params:{
                    coaId:caseCause.id,
                }
            }
        }).then((res)=>{
            if(res.resultCode === 0){
                message.success('案由审批通过操作成功，系统更新中')
                this.props.history.push("/manage")
            }
        })
    }

    caseCauseNotPass = (caseCause) => {
        axios.ajax({
            url:'/manager/notPassCauseOfAction',
            method:'get',
            data:{
                params:{
                    coaId:caseCause.id,
                }
            }
        }).then((res)=>{
            if(res.resultCode === 0){
                message.success('案由审批不通过操作成功')
                this.props.history.push("/manage")
            }
        })
    }

    render() {
        let caseCause = this.props.location.state
        console.log(caseCause)
        let config = {
            'CRIMINAL': '刑事',
            'CIVIL': '民事',
            'ADMINISTRATIVE': '行政',
        }
        const columns = [
            {
                title: '信息项ID',
                dataIndex: 'id',
                key: 'id',
                width: 80
            },
            {
                title: '信息项名称',
                dataIndex: 'name',
                key: 'name',
                width: 100
            },
            {
                title: '信息项代码',
                dataIndex: 'code',
                key: 'code'
            }
        ]
        return (
            <Card title="审批案由" className="review-card">
                <Row className = "detail-row">
                    <Col span={3} offset = {1}>案由名称:</Col>
                    <Col span={20}>{caseCause.name}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={3} offset = {1}>案由提交者:</Col>
                    <Col span={20}>{caseCause.account}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={3} offset = {1}>类型:</Col>
                    <Col span={20}>{config[caseCause.type]}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={3} offset = {1}>所需import语句:</Col>
                    <Col span={20}>{caseCause.importPackages ? caseCause.importPackages : '无'}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={3} offset = {1}>已有信息项:</Col>
                    <Col span={20}>{caseCause.infoItems != []?caseCause.infoItems.map(item => <Tag color="cyan">{item.name}</Tag>):'无'}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={3} offset = {1}>新建信息项:</Col>
                    <Col span={20}>
                        <Table size="small" dataSource={caseCause.ownInfoItems?caseCause.ownInfoItems.map(item => {return ({key:item.id,...item})}):[]} columns={columns} />
                    </Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={4} offset={4}>
                        <Button onClick = {()=>{this.caseCauseEdit(caseCause)}} type="link">
                        编辑案由
                        </Button>
                    </Col>
                    <Col span={6} offset={10}>
                        <Button type="primary" onClick = {()=>{this.caseCausePass(caseCause)}}>
                        审批通过
                        </Button>
                        <Button style={{marginLeft: '20px'}}  onClick = {()=>{this.caseCauseNotPass(caseCause)}}>
                        审批不通过
                        </Button>
                    </Col>
                </Row>
            </Card>
        )
    }
}