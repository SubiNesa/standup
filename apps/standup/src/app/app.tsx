import React, { useState } from 'react';
import styles from './app.module.scss';

import { Route, Redirect, Switch } from 'react-router-dom';

import { environment } from '../environments/environment';

import useToken from './token';
import Login from './login';
import { HomeNavbar } from './navbar';
import { FrontStandupHome } from '@standup/front/standup/home';
import { FrontStandupGoal } from '@standup/front/standup/goal';
import { FrontStandupAdmin } from '@standup/front/standup/admin';
import { FrontStandupProfile } from '@standup/front/standup/profile';

export function App() {
  const mainPanel = React.useRef(null);

  const { token, setToken } = useToken();

  const ProtectedRoute = ({ component: Comp, loggedIn }) => {
    if (loggedIn) {
      return <Comp />;
    }
    localStorage.removeItem('token');
    return <Redirect to={`${environment.path}`} />;
  };

  return (
    <Switch>
      <Route exact path={`${environment.path}`}>
        <Route path={`${environment.path}profile`} component={FrontStandupProfile} />
        <Login setToken={setToken} />
      </Route>
      <Route exact path={`${environment.path}home`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <FrontStandupHome />
            </div>
          </div>
        </div>
      </Route>
      <Route path={`${environment.path}admin`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <ProtectedRoute loggedIn={token} component={FrontStandupAdmin} />
            </div>
          </div>
        </div>
      </Route>
      <Route exact path={`${environment.path}goal`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <ProtectedRoute loggedIn={token} component={FrontStandupGoal} />
            </div>
          </div>
        </div>
      </Route>
      <Route exact path={`${environment.path}profile`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <ProtectedRoute loggedIn={token} component={FrontStandupProfile} />
            </div>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
