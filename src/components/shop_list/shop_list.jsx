import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { is, fromJS } from 'immutable';

import { imgUrl } from '../../config/envconfig';
import API from '@/api/api';
import './shop_list.scss';

class ShopList  extends Component {
    static propTypes = {
        geohash: PropTypes.array.isRequired //经纬度信息
    }
    state = {
        shopListArr: [] //商店列表
    }
    // 评价星星
    starCount(rating) {
        let items = [];
        for(let i = 0; i < Math.ceil(rating); i++) {
            items.push(<div className="icon-wuxing" key={`star${i}`}></div>);
        }
        return items;
    }
    async getShopList(props) {
        let obj = {
            latitude: props.geohash[0],
            longitude: props.geohash[1]
        }
        const shopListArr = await API.getShopList(obj);
        this.setState({
            shopListArr: shopListArr
        })
    }
    componentWillMount() {
        if(this.props.geohash.length) {
            this.getShopList(this.props);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        let refresh = !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
        if(refresh) {
            this.getShopList(nextProps);
        }
        return refresh;
    }
    render() {
        return (
            <div className="shoplist-container">
                <ul>
                    {
                        this.state.shopListArr.map((item, index) => {
                            return (
                                <Link className="shop-item" key={`list${index}`} to={`/sop/${item.id}`}>
                                    <img src={imgUrl + item.image_path} alt=""/>
                                    <div className="shop-content">
                                        <div className="shop-content-title">
                                            <div className="title-left">
                                                <span>品牌</span>
                                                <span>{item.name}</span>
                                            </div>
                                            <div className="title-right">保准票</div>
                                        </div>
                                        <div className="shop-content-title">
                                            <div className="title-left">
                                                <div className="star-num">
                                                    {this.starCount(item.rating)}
                                                </div>
                                                <div className="star-rating">
                                                    {item.rating}
                                                </div>
                                                <div className="order-num">
                                                    月售{item.recent_order_num}单
                                                </div>
                                            </div>
                                            <div className="title-right order-badge">
                                                <span>蜂鸟专送</span>
                                                <span>准时达</span>
                                            </div>
                                        </div>
                                        <div className="shop-content-title">
                                            <div className="fee-left">
                                                <span className="fee-text">￥{item.float_minimum_order_amount}起送</span>
                                                <span className="segmentation">/</span>
                                                <span className="fee-text">{item.piecewise_agent_fee.tips}</span>
                                            </div>
                                            <div className="fee-right">
                                                <span>{item.distance}</span>
                                                <span>/</span>
                                                <span>{item.order_lead_time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default ShopList;