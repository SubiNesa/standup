import { useState } from 'react';
import { useHistory } from 'react-router';

import { environment } from '../environments/environment';

export default function useToken() {
  const history = useHistory();

  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    return JSON.parse(tokenString);
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (token) => {
    if (token) {
      localStorage.setItem('token', JSON.stringify(token));
      setToken(token);
      history.push(`${environment.path}home`);
    }
  };

  return {
    setToken: saveToken,
    token,
  };
}
