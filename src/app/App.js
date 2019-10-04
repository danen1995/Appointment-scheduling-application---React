import React, { Component } from 'react';
import './App.css';
import LoadingIndicator from '../common/LoadingIndicator';
import { getCurrentUser } from '../util/APIUtils';
import Login from '../user/login/Login';
import Calendar from '../calendar/Calendar';

import Profile from '../user/profile/Profile';

import { ACCESS_TOKEN } from '../constants';
import {
  Route,
  withRouter,
  Switch
} from 'react-router-dom';
import AppHeader from '../common/AppHeader';
import { Layout, notification } from 'antd';
import Signup from '../user/signup/Signup';
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
  }


  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
      <Layout className="app-container">
        <AppHeader isAuthenticated={this.state.isAuthenticated}
          currentUser={this.state.currentUser}
          onLogout={this.handleLogout} />

        <Content className="app-content">
          <div className="container">
            <Switch>
              <Route path="/login"
                render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
              <Route path="/users/me"
                render={(props) => <Profile  {...props} />}></Route>
              <Route path="/signup"
                render={(props) => <Signup  {...props} />}></Route>
              <Route path="/calendar"
                render={(props) => <Calendar className="fc-view-container"  {...props} />}></Route>
            </Switch>
          </div>
        </Content>
      </Layout>
    );
  }

  componentDidMount() {
    this.loadCurrentUser();
  }

  handleLogout(redirectTo = "/", notificationType = "success", description = "You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: 'Success',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Success!',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });
      });
  }
}

export default withRouter(App);
