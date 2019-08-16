import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { is, fromJS} from 'immutable'; //保证数据的不可变
import Swiper from 'swiper/dist/js/swiper.js';
import 'swiper/dist/css/swiper.css';

import { saveAttrInfo } from '@/store/action';
import API from '@/api/api';
import './msite.scss';

import Header from '@/components/header/header';
import ShopList from '@/components/shop_list/shop_list';
import Footer from '@/components/footer/footer';
import Loader from '@/components/loader/loader';

class Msite extends Component {
    static propTypes = {
        saveAttrInfo: PropTypes.func.isRequired
    }
    state = {
        title: '', //header的title
        footTypes: [],
        geohash: [],
        imgBaseUrl: "https://fuss10.elemecdn.com", //图片基础地址
    }
    // 返回我的页面
    goHome() {
        this.props.history.push('/');
    }
    // 解码url地址，求去restaurant_category_id 值
    getCategoryId(url) {
        let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''));
        if(/restaurant_category_id/gi.test(urlData)) {
            return JSON.parse(urlData).restaurant_category_id.id
        } else {
            return 270;
        }
    }
    async cityGuess() {
        let res = await API.cityGuess();
        this.setState({
            geohash: [res.latitude, res.longitude]
        });
        this.props.saveAttrInfo('geohash', [res.latitude, res.longitude]);
        this.getPoisSite([res.latitude, res.longitude]);
        this.getFoodTypes();
    }
    // 根据经纬度获取地点信息
    async getPoisSite(geohash) {
        let res = await API.getPoisSite(geohash);
        this.setState({
            title: res.name
        })
    }
    async getFoodTypes() {
        let data = {
            geohash: this.state.geohash,
            'flag[]': 'F',
            group_type: 1
        }
        let res = await API.getFoodTypes(data);
        let resLength = res.length;
        let resArr = [...res];
        let foodArr = [];
        for(let i = 0, j = 0; j < resLength; i +=8, j++) {
            foodArr[j] = resArr.splice(0, 8);
        }
        this.setState({
            footTypes: foodArr
        });
        new Swiper('.swiper-container', {
            pagination: {
                el: '.swiper-pagination'
            },
            loop: true
        })
    }
    componentDidMount() {
        this.cityGuess();
    }
    shouldComponentUpdate(nextProps, nextState) {
        let refresh = !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState));
        return refresh;
    }
    render() {
        let foodTypeContainer = !this.state.footTypes.length && <div className="food-types-container">
            {
                [1,2,3,4,5,6,7,8].map((item, index) => {
                    return (
                        <div className="food-item" key={index}>
                            <div className="food-item-inner"></div>
                        </div>
                    )
                })
            }
        </div>;
        let swiper = this.state.footTypes.map((foodItem, index) => {
            return (
                <div className="swiper-slide food-types-container" key={index}>
                    {
                        foodItem.map((item, index) => {
                            return (
                                <Link className="link-to-food" key={`link${index}`} to={`/food/${this.state.geohash}/${this.getCategoryId(item.link)}/${item.title}`}>
                                    <figure>
                                        <img src={this.state.imgBaseUrl + item.image_url} alt=""/>
                                        <figcaption>{item.title}</figcaption>
                                    </figure>
                                </Link>
                            )
                        })
                    }
                </div>
            )
        })
        const skeletonDom = (value) => {
            let domArr = [];
            value.forEach((item, index) => {
                domArr.push(
                    <li className="shop-li" key={index}>
                        <div className="shop-img"></div>
                        <div className="shop-progress">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </li>
                )
            })
            return domArr;
        }
        return (
            <div className="msite">
                <Header title={this.state.title} signUp={true} goHome={this.goHome.bind(this)}></Header>
                <nav className="msite-nav">
                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            {foodTypeContainer}
                            {swiper}
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                </nav>
                <div className="shop-list-container">
                    <header className="shop-header">
                        <div className="icon-shangdian"></div>
                        <span className="shop-header-title">附近商家</span>
                    </header>
                    {
                        this.state.footTypes.length?
                        <ShopList geohash={this.state.geohash}></ShopList>:
                        <div className="skeleton">
                            <ul>
                                {
                                   skeletonDom([1,2,3,4])
                                }
                            </ul>
                        </div>
                    }
                </div>
                {
                    !this.state.footTypes.length?
                    <div className="site-loader">
                        <Loader></Loader>
                    </div>:
                    ''
                }
                <Footer></Footer>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveAttrInfo: (attr, geohash) => dispatch(saveAttrInfo(attr, geohash))
    }
}

export default connect(() => ({}), mapDispatchToProps)(Msite);