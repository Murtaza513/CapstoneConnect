import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import LoginPage from './components/LoginPage';
import Calendar from './components/Calender';
import './custom.css';


export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <Layout>
          <Route exact path='/' component={LoginPage} />
           <Route path='/counter' component={LoginPage} />
           <Route path='/calendar' component={Calendar} />


        <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      </Layout>
    );
  }
}
