import React from 'react';
import styles from './app.module.scss';

import { Route, Link } from 'react-router-dom';

import AdminNavbar from './AdminNavbar';
import { FrontStandupHome } from '@standup/front/standup/home';
import { FrontStandupGoal } from '@standup/front/standup/goal';

import { FrontStandupAdmin } from '@standup/front/standup/admin';

export function App() {
  const mainPanel = React.useRef(null);

  return (
    <div className={styles.app}>
      <div className="wrapper">
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          {/* <div className="content">
            <Switch>{getRoutes(routes)}</Switch>
          </div> */}
          <Route path="/" exact component={FrontStandupHome} />
          <Route path="/admin" component={FrontStandupAdmin} />
          <Route path="/goal" component={FrontStandupGoal} />
        </div>
      </div>
    </div>
  );
}

export default App;
