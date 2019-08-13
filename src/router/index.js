import React, {Component} from 'react';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import asyncComponent from '@/utils/asyncComponent';

const profile = asyncComponent(() => import("@/pages/profile/profile"));
const login = asyncComponent(() => import("@/pages/login/login"));

export default class RouteConfig extends Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route path="/profile" exact component={profile}></Route>
          <Route path="/login" component={login}></Route>
          <Redirect exact from='/' to='/profile'></Redirect>
        </Switch>
      </HashRouter>
    )
  }
}