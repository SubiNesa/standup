import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export function Login({ setToken }) {

    const pageStyle = {
        height: '100%',
        float: 'left',
        backgroundImage: 'url(assets/img/geneva.jpg)',
        backgroundSize: 'cover'
    }

    const leftLay = {
        backgroundColor: 'rgba(135, 63, 217, 0.73)',
        position: 'absolute',
        width: '100%',
        height: '100%',
        padding: '0px'
    }

    const leftTitle = {
        color: 'white',
        height: '100%',
        marginLeft: '20%',
        textShadow: '1px 1px black'
    }

    const rightPage = {
        backgroundColor: 'rgba(255,255,255, 0.92)'
    }

    const [user, setLogin] = useState({
        email: '',
        password: ''
    });

    async function loginUser(credentials) {
        return fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        .then(data => data.json())
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const data = await loginUser(user);
        setToken(data.token);
      }

    const handleChange = (event) => {
        setLogin({...user, [event.target.name]: event.target.value });
    }


  return (
    <Container fluid  style={pageStyle}>
        <Row style={{height: '100%'}}>
            <Col md={8} style={{padding: '0px'}}>
                <div style={leftLay}>
                    <div style={leftTitle}>
                        <div className="h-100 d-table">
                            <div className="d-table-cell align-middle">
                                <h2>StandUp Viewer</h2>
                                <div className="text-justify">The best way to <strong>keep the team happy</strong> & <strong>incrase productivity</strong></div>
                                <div>by visualizing the goals of each teammate on daily bases.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col md={4} style={rightPage}>
                <div className="h-100 w-100 d-table">
                    <div className="d-table-cell align-middle">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="Email" name="email" onChange={handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange}/>
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
  )
}

export default Login;
