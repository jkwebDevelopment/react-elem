import React, {Component} from 'react';
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom'; 
import { is, fromJS } from 'immutable';

import { saveAttrInfo } from '@/store/action';
import './set_user.scss';

import Header from '@/components/header/header';
import Name from './name/name';
import Address from './address/address';
import Add from './add/add';
import AddDetail from './add_detail/add_detail'

class SetUser extends Component {
    static propTypes = {
        saveAttrInfo: PropTypes.func.isRequired,
        userInfo: PropTypes.object
    }
    state = {
        headerTitle: "",
        type: "",
        name: ""
    }
    // 返回
    goBack() {
        let path = this.props.location.pathname.split("/")[2];
        if(path === "add") {
            this.props.history.push("/setuser/address");
        } else if(path === "address") {
            this.props.history.push("/info");
        } else {
            this.props.history.goBack();
        }
    }
    editAddresss() {
        console.log("editAddress")
        console.log(this.props.userInfo.operate);
        let operate = this.props.userInfo.operate === 'edit'?'success':'edit';
        this.props.saveAttrInfo('operate', operate);
    }
    initData(props) {
        let type = props.location.pathname.split("/")[2];
        let headerTitle;
        switch(type) {
            case 'name':
                headerTitle = '修改用户名';
                break;
            case 'address':
                headerTitle = '编辑地址';
                break;
            case 'add':
                headerTitle = '新增地址';
                break;
            case 'add_detail':
                headerTitle = '搜索地址';
                break;
            default:
                headerTitle = '';
        }
        this.setState({
            headerTitle,
            type
        })
    }
    componentDidMount() {
        console.log(this.props);
        console.log(111);
        this.initData(this.props);
    }
    componentWillReceiveProps(nextProps) {
        console.log(222);
        if(!is(fromJS(this.props.location.pathname), fromJS(nextProps.location.pathname))){
            this.initData(nextProps);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log(333);
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    render() {
        return (
            <div className="rating-page">
                <QueueAnim type="bottom">
                    <Header title={this.state.headerTitle} goBack={this.goBack.bind(this)} edit={this.state.type === 'address'?this.editAddresss.bind(this): null}></Header>
                    <Switch>
                        <Route path={`${this.props.match.path}/name`} component={Name}></Route>
                        <Route path={`${this.props.match.path}/address`} component={Address}></Route>
                        <Route path={`${this.props.match.path}/add/:type`} component={Add}></Route>
                        <Route path={`${this.props.match.path}/add_detail`} component={AddDetail}></Route>
                    </Switch>
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
        saveAttrInfo: (attr, operate) => dispatch(saveAttrInfo(attr, operate))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetUser);