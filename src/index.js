import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import {Provider} from 'react-redux';
import {AppContainer} from 'react-hot-loader';

import Route from './router';
import store from '@/store';

import './config/rem'
import './style/base.scss'

FastClick.attach(document.body)

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component/>
      </AppContainer>
    </Provider>,
    document.getElementById('root')
  )
}

render(Route)
