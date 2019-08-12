import React, {Component} from 'react';


class AlertTip extends Component {

    handleClick() { //关闭
        this.props.closeTip();
    }
    handleLogout() { //退出登录
        this.props.logout();
    }

    render() {
        return (
            <div className="alert-container">
                <section className="tip-text-container">
                    <div className="tip-icon">
                        <span></span>
                        <span></span>
                    </div>
                    <div className="tip-text">{this.props.alertText}</div>
                    {this.props.logout('wait')?
                        <div className="logout">
                            <div onClick={this.handleClick}>再等等</div>
                            <div onClick={this.handleLogout}>狠心离开</div>
                        </div>
                    }
                </section>
            </div>
        )
    }
}

export default AlertTip;