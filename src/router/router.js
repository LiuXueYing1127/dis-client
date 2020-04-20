import React from 'react'
import { HashRouter,Route,Switch } from 'react-router-dom'
import Login from '../pages/Login'
import Manage from '../pages/manage/manage'
import CaseCauseList from '../pages/manage/CaseCauseList'
import CaseCauseAdd from '../pages/manage/CaseCauseAdd'
import Extract from '../pages/Extract'
import NoMatch from '../pages/noMatch'

export default class IRouter extends React.Component {
    render(){
        return (
            <HashRouter>
                <div>
                    <Switch>
                        <Route path="/login" component={Login}></Route>
                        <Route path="/manage" render={()=>
                            <Manage>
                                <Switch>
                                    <Route path="/manage/caseCauseList" component={CaseCauseList}></Route>
                                    <Route path="/manage/caseCauseAdd" component={CaseCauseAdd}></Route>
                                </Switch>
                            </Manage>
                        }></Route>
                        <Route path="/extract" render={()=>
                            <Extract />
                        }></Route>
                        <Route component={NoMatch}></Route>
                    </Switch>
                </div>
            </HashRouter>
        )
    }
}