import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import styles from './front-standup-profile.module.scss';
/* eslint-disable-next-line */
export interface FrontStandupProfileProps {}

export function FrontStandupProfile(props: FrontStandupProfileProps) {
    const history = useHistory();
    const params: any = useParams();

    // loading
    const [isLoading, setLoading] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(true);
    // user
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        current: ''
    });

    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''
        }
    };

    useEffect(() => {
        fetch(`/api/users/me`, requestOptions)
          .then((res) =>  !res.ok ? history.push('/') : res.json())
          .then((user) => {
            setUser({ ...user, ...user });
          });
    }, [setUser]);
    
    const handleChange = (event) => {

      if (event.target.name === 'confirm') {
          if (event.target.value !== user.password) {
            setInvalidPassword(true);
          } else {
            setInvalidPassword(false);
          }
        }
        if (event.target.name !== 'confirm') {
            setUser({...user, [event.target.name]: event.target.value });
        }

        console.log(invalidPassword);
    }

    const saveUser = (data) => {
        setLoading(true);
        
        const requestOptions = {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''
            },
            body: JSON.stringify(data)
        };
        
        fetch(`/api/users/me`, requestOptions)
          .then(async response => {
              const data = await response.json();
    
              setLoading(false);
    
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  const error = (data && data.message) || response.status;
                  return Promise.reject(error);
              } else {
                history.push("/home");
              }
          })
          .catch(error => {
              setLoading(false);
              console.error('There was an error!', error);
          });
    }

    const onUserSubmit = (event) => {
        event.preventDefault();
        console.log(user);
        saveUser(user);
    }

    return (        
        <div>
            <div className={styles.header}>
                <Container>
                    <Row>
                        <Col><h3>Profile • User</h3></Col>
                    </Row>
                </Container>
            </div>
            <div>
                <Container>
                    <Form onSubmit={onUserSubmit}>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={user.name} readOnly />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEmail" >
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={user.email} readOnly />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridCurrentPassword">
                                <Form.Label>Current password</Form.Label>
                                <Form.Control type="text" name="current" required onChange={handleChange}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridNewPassword">
                                <Form.Label>New password</Form.Label>
                                <Form.Control type="text" name="password" required onChange={handleChange}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridConfirmPassword" >
                                <Form.Label>Confirm new password</Form.Label>
                                <Form.Control type="text" name="confirm" onChange={handleChange} required isInvalid={invalidPassword}/>
                                <Form.Control.Feedback type="invalid">
                                  New password do not match!
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Button variant={params.id ? 'outline-primary' : 'primary'} type="submit" disabled={isLoading || invalidPassword}>
                        {isLoading ? 'Saving…' : 'Save'}
                        </Button>
                    </Form>
                </Container>
            </div>
        </div>           
    );
}

export default FrontStandupProfile;