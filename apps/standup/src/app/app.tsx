import React, { useEffect, useState } from 'react';
import styles from './app.module.scss';

import { Route, Redirect, Switch } from 'react-router-dom';

import { environment } from '../environments/environment';

import useToken from './token';
import Login from './login';
import { HomeNavbar } from './navbar';
import { StandupHome } from './home/home';
import { StandupGoal } from './goal/goal';
import { StandupAdmin } from './admin/admin';
import { StandupProfile } from './profile/profile';
import StandupReward from './reward/reward';

export function App() {
  const mainPanel = React.useRef(null);

  const { token, setToken } = useToken();

  const app = sessionStorage.getItem('info');
  const info = app ? JSON.parse(app) : {};

  if (!info.ticket_link) {
    fetch(`${environment.api}app`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((res) =>
        res.json()
      )
    .then((res) => {
      sessionStorage.setItem('info', JSON.stringify(res))
    }
    )
  }


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
        <Route path={`${environment.path}profile`} component={StandupProfile} />
        <Login setToken={setToken} />
      </Route>
      <Route exact path={`${environment.path}home`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <StandupHome />
            </div>
          </div>
        </div>
      </Route>
      <Route exact path={`${environment.path}reward`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <StandupReward />
            </div>
          </div>
        </div>
      </Route>
      <Route path={`${environment.path}admin`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <ProtectedRoute loggedIn={token} component={StandupAdmin} />
            </div>
          </div>
        </div>
      </Route>
      <Route exact path={`${environment.path}goal`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <ProtectedRoute loggedIn={token} component={StandupGoal} />
            </div>
          </div>
        </div>
      </Route>
      <Route exact path={`${environment.path}profile`}>
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token} />
              <ProtectedRoute loggedIn={token} component={StandupProfile} />
            </div>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
