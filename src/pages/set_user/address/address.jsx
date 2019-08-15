import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { is, fromJS } from 'immutable';

import { saveAttrInfo } from '@/store/action';
import API from '@/api/api';
import { getStore } from '@/utils/commons';
import './address.scss';

class Address extends Component {
    static propTypes = {
        saveAttrInfo: PropTypes.func.isRequired,
        hasAddressList: PropTypes.array,
        operate: PropTypes.string
    }
    handleDelete(index) {
        let hasAddressList = [...this.props.hasAddressList.slice(0,index), ...this.props.hasAddressList.slice(index+1)];
        this.props.saveAttrInfo('hasAddressList', hasAddressList);
    }
    async getAddress() {
        const res = await API.getAddress(getStore('user_id'));
        if(Array.isArray(res)) {
            this.props.saveAttrInfo('addressList', res);
        }
    }
    componentDidMount() {
        this.getAddress();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
    }
    render() {
        return (
            <div className="address">
                <ul className="addresslist">
                    {
                        this.props.hasAddressList.map((item, index) => {
                            return (
                                <li key={index}>
                                    <div>
                                        <p>{item.message}</p>
                                        <p><span>{item.telenum}</span>{item.standbytelenum&&<span>,{item.standbytelenum}</span>}</p>
                                    </div>
                                    {
                                        this.props.operate === 'edit'&& 
                                        <div className="deletesite">
                                            <span onClick={this.handleDelete.bind(this, index)}>X</span>
                                        </div>
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
                <Link to="/setuser/add/fromadd">
                    <div className="addsite">
                        <span>新增地址</span>
                        <div className="icon-arrow-right"></div>
                    </div>
                </Link>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        hasAddressList: state.hasAddressList,
        operate: state.operate
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveAttrInfo: (attr, addressList) => dispatch(saveAttrInfo(attr, addressList))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Address);