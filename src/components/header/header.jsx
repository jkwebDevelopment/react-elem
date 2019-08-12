import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {is, fromJS} from 'immutable'; //保证数据的不可变
import {connect} from 'react-redux';
import './header.scss';

class Header extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        signUp: PropTypes.bool,
        goBack: PropTypes.func,
        goHome: PropTypes.func,
        edit: PropTypes.func,
        userInfo: PropTypes.object.isRequired
    }
    state = {
        headTitle: '首页'
    }
    handleBack = () => {
        this.props.goBack();
    }
    handleEdit = () => {
        this.props.edit();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.porps), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    render() {
        return (
            <header className="header-container">
                {this.props.goBack && <div className="icon-back header-back" onClick={this.handleBack}></div>}
                <div className="header-title">{this.props.title}</div>
                {this.props.signUp?(this.props.userInfo ? <span className='icon-account user-avatar' onClick={this.props.goHome}></span>:<span>登录|注册</span>):''}
                {this.props.edit && <div onClick={this.handleEdit} className='user-avatar'>{this.props.userInfo.operate === 'edit'?'编辑':'完成'}</div>}
            </header>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo
    }
}

export default connect(mapStateToProps, {})(Header);