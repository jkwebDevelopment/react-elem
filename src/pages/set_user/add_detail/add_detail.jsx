import React, {Component} from 'react';
import {connect} from 'react-redux';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types'

import { saveAttrInfo } from '@/store/action';
import API from '@/api/api'
import './add_detail.scss';

class AddDetail extends Component {
    static propTypes = {
        saveAttrInfo: PropTypes.func.isRequired,
        addressList: PropTypes.array
    }
    state = {
        inputAddress: "", //地址
        isShow: true, //展示提示信息
    }
    handleChange(e) {
        let value = e.target.value;
        this.setState({
            inputAddress: value,
            isShow: false
        })
    }
    async handleSearch() {
        let obj = {
            type: 'nearby',
            keyword: this.state.inputAddress
        }
        let res = await API.searchPois(obj);
        if(Array.isArray(res)) {
            this.props.saveAttrInfo('addressList', res);
        }
    }
    handleChoose(name) {
        this.props.saveAttrInfo('addressName', name);
        this.props.history.push('/setuser/add/addetail');
    }
    componentDidMount() {
        if(Array.isArray(this.props.addressList) && this.props.addressList.length > 0) {
            this.setState({
                isShow: false
            })
        }
    }
    render() {
        let addressDom = this.props.addressList.map((item, index) => {
            return (
              <li onClick={this.handleChoose.bind(this, item.name)} key={index}>
                <p>{item.name}</p>
                <p>{item.address}</p>
              </li>
            )
        })
        return (
            <div>
                <QueueAnim>
                    <div className="add-detail">
                        <input type="text" placeholder="请输入小区/写字楼/学校等" value={this.state.inputAddress} onChange={this.handleChange.bind(this)}/>
                        <button onClick={this.handleSearch.bind(this)}>确认</button>
                    </div>
                    <div className="warnpart">为了满足商家的送餐要求，建议您从列表中选择地址</div>
                    {
                        this.state.isShow &&
                        <div className="point">
                            <p>找不到地址？</p>
                            <p>请尝试输入小区、写字楼或学校名</p>
                            <p>详细地址(如门牌号)可稍后输入哦。</p>
                        </div>
                    }
                    <div className="poisearch-container">
                        <ul>
                            {addressDom}
                        </ul>
                    </div>
                </QueueAnim>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        addressList: state.addressList
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        saveAttrInfo: (attr, addressList) => dispatch(saveAttrInfo(attr, addressList))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDetail);