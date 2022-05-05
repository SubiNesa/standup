import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faClock,
  faExclamationTriangle,
  faBullseye,
  faComment,
  faComments,
  faCommentMedical,
  faFlagCheckered,
  faEdit,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
library.add(
  fab,
  faExclamationTriangle,
  faBullseye,
  faClock,
  faComment,
  faComments,
  faCommentMedical,
  faFlagCheckered,
  faEdit,
  faTrashAlt
);

import App from './app/app';

import { BrowserRouter } from 'react-router-dom';

import { environment } from './environments/environment';

// const [ info, setInfo ] = useState({});

// useEffect(() => {
//   fetch(`${environment.api}app`)
//     .then((res) => res.json())
//     .then((app) => {
//       console.log(app);
    
//       setInfo({ ...info, ...app });
//     });
// }, []);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
