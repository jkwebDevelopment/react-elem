import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';
import { Link } from 'react-router-dom';

import { saveAttrInfo } from '@/store/action';
import './add.scss';

class Add extends Component {
    static propTypes = {
        saveAttrInfo: PropTypes.func.isRequired,
        userInfo: PropTypes.object,
        addressName: PropTypes.string
    }
    state = {
        vertifies: "",
        message: "", //姓名
        verify: false, //姓名验证
        mesthree: "", //送餐地址
        verifythree: false, //地址验证
        telenum: "", //联系人电话
        verifyfour: false, //联系人电话验证
        telephone: "", //联系人电话验证失败提示
        sendaddress: "", //送餐地址提示信息
        verifyfive: false, //备用联系人电话验证
        standbytelenum: "", //备用联系人电话
        standbytele: "", //备用联系人电话验证失败提示
    }
    saveMessage() {
        this.props.saveAttrInfo('temMessage', this.state.message);
    }
    handleInput(type, e) {
        let newState = {}               ;
        let value = e.target.value;
        newState[type] = value;
        switch(type) {
            case 'message':
                this.messageVali(value);
                break;
            case 'mesthree':
                this.mesthreeVali(value);
                break;
            case 'telenum':
                this.teleVali(value);
                break;
            case 'standbytelenum':
                this.standbyVali(value);
                break;
            default: 
                break;
        }
        this.setState({
            ...newState
        })
    }
    messageVali(value) {
        this.setState({
            verify: value ? false : true
        })
        this.bindThing();
    }
    bindThing() {
        if(this.state.message && this.state.mesthree && this.state.telenum && !this.verifyFour) {
            this.setState({
                butopacity: 'butopacity'
            })
        } else {
            this.setState({
                butopacity: ""
            })
        }
    }
    // 送餐地址校验
    mesthreeVali(value) {
        let sendaddress, verifythree = true;
        if(value.length === 0) {
            sendaddress = "请详情填写送餐地址";
        } else if(value.length > 0 && value.length <= 2) {
            sendaddress = "送餐地址太短了，不能辨识";
        } else {
            sendaddress = "";
            verifythree = false;
        }
        this.setState({
            verifythree,
            sendaddress
        })
        this.bindThing();
    }
    // 手机号校验
    teleVali(value) {
        let telephone, verifyfour = true;
        if((/^[1][358][0-9]{9}$/).test(value)) {
            verifyfour = false;
        } else if(value === "") {
            telephone = "手机号不能为空";
        } else {
            telephone = "请输入正确的手机号";
        }
        this.setState({
            verifyfour,
            telephone
        });
        this.bindThing();
    }
    standbyVali(value) {
        let standbytele, verifyfive = true;
        if((/^[1][358][0-9]{9}$/).test(value) || value === '') {
            verifyfive = false;
        } else {
            standbytele = "请输入正确的手机号";
        }
        this.setState({
            verifyfive,
            standbytele
        })
        this.bindThing();
    }
    // 添加地址
    handleAdd() {
        if(this.state.butopacity !== "butopacity") {
            return;
        }
        let hasAddressList = this.props.hasAddressList;
        hasAddressList.push({
            mesthree: this.state.mesthree,
            telenum: this.state.telenum,
            address: this.props.userInfo.addressName,
            standbytelenum: this.state.standbytelenum,
            message: this.state.message
        });
        this.props.saveAttrInfo('hasAddressList', hasAddressList);
        this.props.history.push('/setuser/address');
    }
    componentDidMount() {
        if(this.props.match.params.type === 'fromadd') {
            this.props.saveAttrInfo('addressName', '');
        } else {
            this.setState({
                message: this.props.temMessage
            })
        }
    }
    render() {
        return (
            <div className="adddetail">
                <form className="add-form">
                    <section className="ui-padding-block">
                        <QueueAnim>
                            <div className="input-new">
                                <input type="text" placeholder="请输入你的姓名" className={this.state.vertifies} value={this.state.message} onChange={this.handleInput.bind(this, 'message')}/>
                                {this.state.verify&&<p>请输入您的姓名</p>}
                            </div>
                            <Link className="add-detail" to="/setuser/add_detail" onClick={this.saveMessage.bind(this)}>
                                <div className="input-new">
                                    <input type="text" placeholder="小区/写字楼/学校等" readOnly="readonly" value={this.props.addressName}/>
                                </div>
                            </Link>
                            <div className="input-new">
                                <input type="text" placeholder="请填写详细送餐详情" className={this.state.vertifies} value={this.state.mesthree} onChange={this.handleInput.bind(this, 'mesthree')}/>
                                {
                                    this.state.verifythree &&
                                    <p>{this.state.sendaddress}</p>
                                }
                            </div>
                            <div className="input-new">
                                <input type="text" placeholder="请填写能够联系到您的手机号" className={this.state.vertifies} value={this.state.telenum} onChange={this.handleInput.bind(this, 'telenum')}/>
                                {
                                    this.state.verifyfour &&
                                    <p>{this.state.telephone}</p>
                                }
                            </div>
                            <div className="input-new">
                                <input type="text" placeholder="备用联系人电话(选填)" className={this.state.vertifies} value={this.state.standbytelenum} onChange={this.handleInput.bind(this, 'standbytelenum')}/>
                                {
                                    this.state.verifyfive&&
                                    <p>{this.state.standbytele}</p>
                                }
                            </div>
                        </QueueAnim>
                    </section>
                    <section className="addbutton">
                        <button className={this.state.butopacity} onClick={this.handleAdd.bind(this)}>新增地址</button>
                    </section>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo,
        addressName: state.addressName,
        temMessage: state.temMessage,
        hasAddressList: state.hasAddressList
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        saveAttrInfo: (attr, hasAddressList) => dispatch(saveAttrInfo(attr, hasAddressList))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add);