import React, { CSSProperties } from 'react';
import Switch from 'react-bootstrap/esm/Switch';

import { Route } from 'react-router-dom';

import UsersList from './users/users-list';
import UsersCreate from './users/users-create';

import { environment } from '../../environments/environment';

/* eslint-disable-next-line */
export interface StandupAdminProps {}

const switchStyle: CSSProperties = {
  'paddingLeft': '0px'
 }

export function StandupAdmin(props: StandupAdminProps) {
  return (
    <div>
      <Switch style={switchStyle} > 
        <Route exact path={`${environment.path}admin`}>
          <UsersList />
        </Route>
        <Route exact path={`${environment.path}admin/user`}>
          <UsersCreate />
        </Route>
        <Route path={`${environment.path}admin/user/:id`}>
          <UsersCreate />
        </Route>
        <Route>
        </Route>
      </Switch>
    </div>
  );
}

export default StandupAdmin;
