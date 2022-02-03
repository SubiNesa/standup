import React, { CSSProperties, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import { environment } from '../environments/environment';

export function Login({ setToken }) {
  const pageStyle: CSSProperties = {
    height: '100%',
    float: 'left',
    backgroundImage: 'url(assets/img/geneva.jpg)',
    backgroundSize: 'cover',
  };

  const leftLay: CSSProperties = {
    backgroundColor: 'rgba(135, 63, 217, 0.73)',
    width: '100%',
    height: '100%',
    padding: '0px',
  };

  const leftTitle: CSSProperties = {
    color: 'white',
    height: '100%',
    marginLeft: '20%',
    textShadow: '1px 1px black',
  };

  const rightPage: CSSProperties = {
    backgroundColor: 'rgba(255,255,255, 0.92)',
  };

  const [invalid, setInvalid] = useState(false);

  const [user, setLogin] = useState({
    email: '',
    password: '',
  });

  async function loginUser(credentials) {
    return fetch(`${environment.api}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then(async (response) => {
      const data = await response.json();

      // check for error response
      if (!response.ok) {
        setInvalid(true);
      }

      return data;
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(user);
    setToken(data.token);
  };

  const handleChange = (event) => {
    setLogin({ ...user, [event.target.name]: event.target.value });
  };

  return (
    <Container fluid style={pageStyle}>
      <Row style={{ height: '100%' }}>
        <Col md={8} style={{ padding: '0px' }}>
          <div style={leftLay}>
            <div style={leftTitle}>
              <div className="h-100 d-table">
                <div className="d-table-cell align-middle">
                  <h2>StandUp Viewer</h2>
                  <div className="text-justify">
                    The best way to <strong>keep the team happy</strong> &{' '}
                    <strong>incrase productivity</strong>
                  </div>
                  <div>
                    by visualizing the goals of each teammate on daily bases.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md={4} style={rightPage}>
          <div className="h-100 w-100 d-table">
            <div className="d-table-cell align-middle">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    isInvalid={invalid}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    isInvalid={invalid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Invalid credentials!
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="secondary" type="submit">
                  Login
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
