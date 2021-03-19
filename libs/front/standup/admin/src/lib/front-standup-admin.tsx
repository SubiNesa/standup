import React from 'react';
import Switch from 'react-bootstrap/esm/Switch';

import { Route } from 'react-router-dom';


import UsersList from './users/users-list';
import UsersCreate from './users/users-create';

/* eslint-disable-next-line */
export interface FrontStandupAdminProps {}

const switchStyle = {
  'paddingLeft': '0px'
 }

export function FrontStandupAdmin(props: FrontStandupAdminProps) {
  return (
    <div>
      <Switch style={switchStyle} > 
        <Route exact path="/admin">
          <UsersList />
        </Route>
        <Route exact path="/admin/user">
          <UsersCreate />
        </Route>
        <Route path="/admin/user/:id">
          <UsersCreate />
        </Route>
        <Route>
        </Route>
      </Switch>
    </div>
  );
}

export default FrontStandupAdmin;
