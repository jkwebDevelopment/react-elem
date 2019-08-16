import React, {Component} from 'react';
import {HashRouter, Switch, Route, Redirect} from 'react-router-dom';
import asyncComponent from '@/utils/asyncComponent';

const profile = asyncComponent(() => import("@/pages/profile/profile"));
const login = asyncComponent(() => import("@/pages/login/login"));
const info = asyncComponent(() => import("@/pages/info/info"));
const setUser = asyncComponent(() => import("@/pages/set_user/set_user"));
const msite = asyncComponent(() => import("@/pages/msite/msite"));

export default class RouteConfig extends Component {
  render () {
    return (
      <HashRouter>
        <Switch>
          <Route path="/profile" exact component={profile}></Route>
          <Route path="/login" component={login}></Route>
          <Route path="/info" component={info}></Route>
          <Route path="/setuser" component={setUser}></Route>
          <Route path="/msite" component={msite}></Route>
          <Redirect exact from='/' to='/profile'></Redirect>
        </Switch>
      </HashRouter>
    )
  }
}