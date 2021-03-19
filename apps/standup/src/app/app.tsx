import React, { useState } from 'react';
import styles from './app.module.scss';

import { Route, Redirect, Switch } from 'react-router-dom';

import useToken from './token';
import Login from './Login';
import { HomeNavbar } from './navbar';
import { FrontStandupHome } from '@standup/front/standup/home';
import { FrontStandupGoal } from '@standup/front/standup/goal';
import { FrontStandupAdmin } from '@standup/front/standup/admin';

export function App() {
  const mainPanel = React.useRef(null);

  const { token, setToken } = useToken();

  const ProtectedRoute = ({ component: Comp, loggedIn}) => {
    return loggedIn ? <Comp/> : <Redirect to="/" />;
  };

  
  console.log(token);

  return (
    <Switch>
      <Route exact path="/">
          <Login setToken={setToken} />
      </Route>
      <Route exact path="/home">
        <div className={styles.app}>
          <div className="wrapper">
            <div className="main-panel" ref={mainPanel}>
              <HomeNavbar token={!!token}/> 
              <FrontStandupHome />
            </div>
          </div>
        </div>
        
      </Route>
      <Route path="/admin">
        <div className={styles.app}>
            <div className="wrapper">
              <div className="main-panel" ref={mainPanel}>
                <HomeNavbar token={!!token}/> 
                <ProtectedRoute loggedIn={token} component={FrontStandupAdmin}/>
              </div>
            </div>
        </div>
      </Route>
      <Route exact path="/goal">
        <div className={styles.app}>
            <div className="wrapper">
              <div className="main-panel" ref={mainPanel}>
                <HomeNavbar token={!!token}/> 
                <ProtectedRoute loggedIn={token} component={FrontStandupGoal}/>
              </div>
            </div>
        </div>
      </Route>
    </Switch>

  );
}

export default App;
