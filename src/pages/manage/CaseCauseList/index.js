import React from 'react'
import {Card, Table, Tag, Button} from 'antd'
import './index.less'

export default class CaseCauseList extends React.Component {
    toCaseCauseAdd = ()=>{
        this.props.history.push("/manage/caseCauseAdd")
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
            },
            {
                title: '信息项',
                key: 'infoItems',
                dataIndex: 'infoItems',
                render: infoItems => (
                    <span>
                        {infoItems.map(infoItem => (
                            <Tag color="blue" key={infoItem}>
                            {infoItem}
                            </Tag>
                        ))}
                    </span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                render: () => (
                    <span>
                        <a style={{ marginRight: '16px' }}>查看</a>
                        <a>编辑</a>
                    </span>
                ),
            },
        ]; 
        const data = [
            {
                key: '1',
                id: '1',
                name: '离婚纠纷',
                type: '民事',
                infoItems: ['相识时间', '是否分居'],
            },
            {
                key: '2',
                id: '2',
                name: '故意杀人罪',
                type: '刑事',
                infoItems: ['行凶工具'],
            },
          ];         
        return(
            <div>
                <Card title="案由列表" className="list-card">
                    <Button onClick={this.toCaseCauseAdd} type="primary" style={{ marginBottom: 16 }}>
                        新建案由
                    </Button>
                    <Table columns={columns} dataSource={data} />
                </Card>
            </div>
        )
    }
}