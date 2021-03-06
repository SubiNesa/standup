import React from 'react';
import ReactDOM from 'react-dom';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faClock, faExclamationTriangle, faBullseye, faComments, faFlagCheckered, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faExclamationTriangle, faBullseye, faClock, faComments, faFlagCheckered, faEdit, faTrashAlt);

import App from './app/app';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
