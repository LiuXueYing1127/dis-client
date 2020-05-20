import React from 'react'
import { NavLink } from 'react-router-dom'
import { Row, Col, Menu } from 'antd'
import './index.less'

export default class Header extends React.Component {
    render(){
        return (
            <div>
                <Row>
                    <Col span={14} className='header-title'>
                        信息抽取系统
                    </Col>
                    <Col span={10}>
                    <Menu mode="horizontal" className='header-menu'>
                        <Menu.Item className='header-menuitem'>
                            <NavLink to='/manage/caseCauseList'>案由管理</NavLink>
                        </Menu.Item>
                        <Menu.Item className='header-menuitem'>
                            <NavLink to='/extract'>要素抽取</NavLink>
                        </Menu.Item>
                        <Menu.Item className='header-menuitem'>
                            <NavLink to='/login?logout=true'>退出</NavLink>
                        </Menu.Item>
                    </Menu>
                    </Col>
                </Row>
            </div>
        )
    }
}