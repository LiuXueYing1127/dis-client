import React from 'react'
import { Result, Button } from 'antd';

export default class NoMatch extends React.Component {

    toHome = () => {
        this.props.history.push("/login?logout=true")
    }

    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick = {this.toHome}>Back Home</Button>}
            />
        )
    }
} 