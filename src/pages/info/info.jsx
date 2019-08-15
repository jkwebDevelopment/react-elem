import React, {Component} from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { is, fromJS } from 'immutable';

import { imgUrl } from '@/config/envconfig';
import { modifyUserInfo } from '@/store/action';
import './info.scss';
import API from '../../api/api';

import Header from '@/components/header/header';
import AlertTip from '@/components/alert_tip/alert_tip';

class Info extends Component {
    static propTypes = {
        modifyUserInfo: PropTypes.func.isRequired,
        userInfo: PropTypes.object.isRequired
    }
    state = {
        hasAlert: false,
        alertText: '',
        logout: false
    }
    // 点击返回
    goBack() {
        this.props.history.push('/profile');
    }
    // 上传头像
    async uploadImg(event) {
        try {
            let formdata = new FormData(); //获取表单
            formdata.append('file', event.target.files[0]);
            let result = await API.uploadImg(formdata);
            this.props.modifyUserInfo(imgUrl + result.image_path);
        }catch(err) {
            throw err;
        }
    }
    // 处理提示
    handleClick(type) {
        let alertText;
        let logout = false;
        switch(type) {
            case 'tele':
                alertText = '请在手机APP中打开';
                break;
            case 'password':
                alertText = '功能尚未开发';
                break;
            case 'logout':
                alertText = '是否退出登录';
                logout = true;
                break;
            default:
        }
        this.setState({
            hasAlert: !this.state.hasAlert,
            alertText,
            logout
        })
    }
    // 退出
    logout(wait) {
        if(!wait) {
            this.props.history.push('/login');
        }
        return this.state.logout;
    }
    shouleComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    render() {
        return (
            <div className="rating-page">
                <QueueAnim type="bottom">
                    <Header title="账户消息" goBack={this.goBack.bind(this)}></Header>
                    <section className="profile-info">
                        <QueueAnim>
                            <section className="headportrait">
                                <input type="file" className="profile-info-upload" onChange={this.uploadImg.bind(this)}/>
                                <h2>头像</h2>
                                <div className="info-avatar">
                                    <img src={this.props.userInfo.imgpath} alt="img id wrong" className="headport-top"/>
                                    <div className="icon-arrow-right"></div>
                                </div>
                            </section>
                            <Link className="info-router" to="/setuser/name">
                                <section className="headportrait headportraitwo">
                                    <h2>用户名</h2>
                                    <div className="info-avatar">
                                        <div>{this.props.userInfo.username}</div>
                                        <div className="icon-arrow-right"></div>
                                    </div>
                                </section>
                            </Link>
                            <Link className="info-router" to="/setuser/address">
                                <section className="headportrait headportraithree">
                                    <h2>收货地址</h2>
                                    <div className="info-avatar">
                                        <div>{this.state.username}</div>
                                        <div className="icon-arrow-right"></div>
                                    </div>
                                </section>
                            </Link>
                            <section className="bind-phone">账号绑定</section>
                            <div className="info-router" onClick={this.handleClick.bind(this, 'tele')}>
                                <section className="headportrait headportraitfour">
                                    <div className="headport-phone">
                                        <div className="icon-shouji"></div>
                                        <h2>手机</h2>
                                    </div>
                                    <div className="info-avatar">
                                        <div className="icon-arrow-right"></div>
                                    </div>
                                </section>
                            </div>
                            <section className="bind-phone">安全设置</section>
                            <div className="info-router" onClick={this.handleClick.bind(this, 'password')}>
                                <section className="headportrait headportraithree">
                                    <h2>登录密码</h2>
                                    <div className="info-avatar">
                                        <div className="headport-modify">修改</div>
                                        <div className="icon-arrow-right"></div>
                                    </div>
                                </section>
                            </div>
                            <section className="exit-login" onClick={this.handleClick.bind(this, 'logout')}>退出登录</section>
                        </QueueAnim>
                    </section>
                    {this.state.hasAlert && <AlertTip logout={this.logout.bind(this)} closeTip={this.handleClick.bind(this)} alertText={this.state.alertText}></AlertTip>}
                </QueueAnim>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        modifyUserInfo: (imgPath) => dispatch(modifyUserInfo('imgpath', imgPath))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);