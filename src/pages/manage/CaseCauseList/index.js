import React from 'react'
import cookie from 'react-cookies'
import {Card, Table, Tag, Button, message, Modal, Row, Col} from 'antd'
import axios from '../../../axios/index'
import './index.less'

class CaseCauseDetail extends React.Component {
    render() {
        let caseCause=this.props.caseCause
        let config = {
            'CRIMINAL': '刑事',
            'CIVIL': '民事',
            'ADMINISTRATIVE': '行政',
        }
        let stateConfig = {
            'REGISTERED': '已注册',
            'NOT_PASSED': '审批未通过',
            'UNDER_REVIEWED': '待审批',
        }
        return(
            <div>
                <Row className = "detail-row">
                    <Col span={6}>案由ID</Col>
                    <Col span={18}>{caseCause.id}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={6}>案由名称</Col>
                    <Col span={18}>{caseCause.name}</Col>
                </Row>  
                <Row className = "detail-row">
                    <Col span={6}>类别</Col>
                    <Col span={18}>{config[caseCause.type]}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={6}>案由状态</Col>
                    <Col span={18}>{stateConfig[caseCause.state]}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={6}>自定义信息项</Col>
                    <Col span={18}>{caseCause.infoItems.map(item=>{
                        if(item.coaId === caseCause.id){
                            return (<Tag onClick = {()=>{this.props.informationItemDetail(item.id)}} color="blue" key={item.id}>{item.name}</Tag>)
                        }else{
                            return null
                        }
                    })}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={6}>配置信息项</Col>
                    <Col span={18}>{caseCause.infoItems.map(item=>{
                        if(item.coaId !== caseCause.id){
                            return (<Tag color="cyan" onClick = {()=>{this.props.informationItemDetail(item.id)}} key={item.id}>{item.name}</Tag>)
                        }else{
                            return null
                        }
                    })}</Col>
                </Row>
            </div>
        )
    }
}

class InformationItemDetail extends React.Component {
    render() {
        let informationItem=this.props.informationItem
        return (
            <div>
                <Row className = "detail-row">
                    <Col span={6}>信息项ID</Col>
                    <Col span={18}>{informationItem.id}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={6}>信息项名称</Col>
                    <Col span={18}>{informationItem.name}</Col>
                </Row>  
                <Row className = "detail-row">
                    <Col span={6}>创建用户账号</Col>
                    <Col span={18}>{informationItem.account}</Col>
                </Row>
                <Row className = "detail-row">
                    <Col span={6}>信息项代码</Col>
                    <Col span={18}>{informationItem.code}</Col>
                </Row>
            </div>
        )
    }
}

export default class CaseCauseList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            caseCauseList: [],
            userAccount: '',
            managerAccount: ''
        }
    }

    componentDidMount = ()=>{
        this.request()
    }

    request = () => {
        if(cookie.load('currentUser')==null && cookie.load('currentManager')==null){
            message.warning('请先登录')
            this.props.history.push("/login");
        }else if(cookie.load('currentUser')!=null){
            let currentUser = cookie.load('currentUser');
            this.setState({
                userAccount: currentUser.account
            })
            axios.ajax({
                url:'/user/getCauseOfActionList',
                method:'get',
                data:{
                    params:{
                        userAccount:currentUser.account
                    }
                }
            }).then((res)=>{
                // eslint-disable-next-line
                if(res.resultCode == 0){
                    let caseCauseList = []
                    for(var c of res.resultData){
                        let casecause = {
                            key: c.id,
                            id: c.id,
                            name: c.name,
                            type: c.type,
                            state: c.state,
                            account: c.account,
                            importPackages: c.importPackages,
                            infoItems: c.infoItems,
                        }
                        caseCauseList.push(casecause)
                    }
                    this.setState({
                        caseCauseList: caseCauseList
                    })
                }
            })
        }else{//cookie.load('currentManager')!=null
            let currentManager = cookie.load('currentManager');
            this.setState({
                managerAccount: currentManager.account
            })
            axios.ajax({
                url:'/manager/getURCauseOfActionList',
                method:'get',
            }).then((res)=>{
                // eslint-disable-next-line
                if(res.resultCode == 0){
                    let caseCauseList = []
                    for(var c of res.resultData){
                        let casecause = {
                            key: c.id,
                            id: c.id,
                            name: c.name,
                            type: c.type,
                            state: c.state,
                            account: c.account,
                            importPackages: c.importPackages,
                            infoItems: c.infoItems,
                        }
                        caseCauseList.push(casecause)
                    }
                    this.setState({
                        caseCauseList: caseCauseList
                    })
                }
            })
        }
    }

    toCaseCauseAdd = ()=> {
        this.props.history.push("/manage/caseCauseAdd")
    }

    caseCauseReview = (caseCause)=> {
        axios.ajax({
            url:'/user/getInfoItemListWithCode',
            method:'get',
            data:{
                params:{
                    coaId:caseCause.id,
                }
            }
        }).then((res)=>{
            // eslint-disable-next-line
            if(res.resultCode == 0){
                let ownInfoItems = res.resultData
                let caseCausewithCode = {
                    id: caseCause.id,
                    account: caseCause.account,
                    name: caseCause.name,
                    type: caseCause.type,
                    state: caseCause.state,
                    importPackages: caseCause.importPackages,
                    infoItems: caseCause.infoItems.filter(item => item.coaId !== caseCause.id),
                    ownInfoItems: ownInfoItems,
                }
                this.props.history.push({pathname:"/manage/caseCauseReview", state:caseCausewithCode})
            }
        })
    }

    caseCauseEdit = (caseCause)=> {
        axios.ajax({
            url:'/user/getInfoItemListWithCode',
            method:'get',
            data:{
                params:{
                    coaId:caseCause.id,
                }
            }
        }).then((res)=>{
            // eslint-disable-next-line
            if(res.resultCode == 0){
                let ownInfoItems = res.resultData
                let caseCausewithCode = {
                    id: caseCause.id,
                    account: caseCause.account,
                    name: caseCause.name,
                    type: caseCause.type,
                    state: caseCause.state,
                    importPackages: caseCause.importPackages,
                    infoItems: caseCause.infoItems.filter(item => item.coaId !== caseCause.id),
                    ownInfoItems: ownInfoItems
                }
                this.props.history.push({pathname:"/manage/caseCauseAdd", state:caseCausewithCode})
            }
        })
    }

    caseCauseDetail = (caseCause)=>{
        Modal.info({
            title: '案由详情',
            width: 700,
            content: (
                <CaseCauseDetail caseCause = {caseCause} userAccount = {this.state.userAccount} informationItemDetail = {this.informationItemDetail}></CaseCauseDetail>
            ),
        })
    }

    informationItemDetail = (informationItemId) => {
        axios.ajax({
            url:'/user/getInformationItemDetail',
            method:'get',
            data:{
                params:{
                    informationItemId:informationItemId
                }
            }
        }).then((res)=>{
            // eslint-disable-next-line
            if(res.resultCode == 0){
                let informationItem = res.resultData
                Modal.info({
                    title: '信息项详情',
                    width: 700,
                    content: (
                        <InformationItemDetail informationItem = {informationItem}></InformationItemDetail>
                    ),
                })
            }
        })
    }



    render(){
        const columns = [
            {
                title: '案由ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '案由名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '类别',
                dataIndex: 'type',
                key: 'type',
                render: (type) => {
                    let config = {
                      'CRIMINAL': '刑事',
                      'CIVIL': '民事',
                      'ADMINISTRATIVE': '行政',
                    }
                    return config[type]
                  },
            },
            {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                render: (state) => {
                    let config = {
                      'REGISTERED': '已注册',
                      'NOT_PASSED': '审批未通过',
                      'UNDER_REVIEWED': '待审批',
                    }
                    return config[state]
                  },
            },
            {
                title: '信息项',
                key: 'infoItems',
                dataIndex: 'infoItems',
                render: (infoItems, caseCause) => (
                    <span>
                        {infoItems.slice(0,5).map(infoItem => (
                            <Tag onClick = {() => {this.informationItemDetail(infoItem.id)}} color={infoItem.coaId === caseCause.id ? "blue" : "cyan"} key={infoItem.id}>
                                {infoItem.name}
                            </Tag>
                        ))}
                        {infoItems.length > 5 ? <span>...</span> : ''}
                    </span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                render: (text, caseCause) => (
                    <span>
                        {this.state.userAccount !== '' ? 
                        <a style={{ marginRight: '16px' }} onClick = {()=>this.caseCauseDetail(caseCause)}>查看</a>
                        :
                        <a style={{ marginRight: '16px' }} onClick = {()=>this.caseCauseReview(caseCause)}>审批</a>
                        }
                        {this.state.userAccount !== '' && caseCause.state !== 'REGISTERED' ? <a onClick = {()=>{this.caseCauseEdit(caseCause)}}>编辑</a> : ''}
                    </span>
                ),
            },
        ];
        if(this.state.managerAccount !== ''){
            columns.splice(1,0,{
                title: '案由提交者',
                dataIndex: 'account',
                key: 'account'
            })
        }
        return(
            <div>
                <Card title="案由列表" className="list-card">
                    {this.state.userAccount !== '' ? 
                    <Button onClick={this.toCaseCauseAdd} type="primary" style={{ marginBottom: 16 }}>
                        新建案由
                    </Button>
                    :
                    ''
                    }
                    <Table columns={columns} dataSource={this.state.caseCauseList} />
                </Card>
            </div>
        )
    }
}