import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import styles from './front-standup-profile.module.scss';
/* eslint-disable-next-line */
export interface FrontStandupProfileProps {}

import { environment } from '../../../../../../apps/standup/src/environments/environment';

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

    const [settings, setSettings] = useState({
        goal: {
          last: undefined,
          search: undefined
        }
      });

    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''
        }
    };

    useEffect(() => {
        fetch(`${environment.api}users/me`, requestOptions)
          .then((res) =>  !res.ok ? history.push(`${environment.path}`) : res.json())
          .then((user) => {
            setUser({ ...user, ...user });
          });
    }, [setUser]);

    // get settings
    useEffect(() => {
        fetch(`${environment.api}users/me/settings`, requestOptions)
        .then((res) =>  !res.ok ? history.push(`${environment.path}`) : res.json())
        .then((data) => {
        if (!data.settings.goal || Object.keys(data.settings.goal).length === 0) {
            setSettings({ ...settings, ...{
            goal: {
                last: false,
                search: false
            }
            }});
        } else {
            setSettings({ ...settings, ...data.settings });
        }
        })
    }, []);
    
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
    }

    const handleSettingsChange = (event) => {
        const data = { ... settings};
        data.goal[event.target.name] = event.target.checked;
        setSettings(data);
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
        
        fetch(`${environment.api}users/me`, requestOptions)
          .then(async response => {
              const data = await response.json();
    
              setLoading(false);
    
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  const error = (data && data.message) || response.status;
                  return Promise.reject(error);
              } else {
                history.push(`${environment.path}home`);
              }
          })
          .catch(error => {
              setLoading(false);
              console.error('There was an error!', error);
          });
    }


  const saveUserSettings = (data) => {    
    const requestOptions = {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''},
      body: JSON.stringify(data)
    };
    
    fetch(`${environment.api}users/me/settings`, requestOptions)
      .then(async response => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            const error = (data && data.message) || response.status;
            console.log(error);
          } else {
            history.push(`${environment.path}home`);
          }
      })
      .catch(error => {
          console.error('There was an error!', error);
      });
  }

    const onUserSubmit = (event) => {
        event.preventDefault();
        saveUser(user);
    }

    const onGoalSettingsSubmit = (event) => {
        event.preventDefault();
        saveUserSettings(settings);
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
                    <h5 className='mb-3'>Settings</h5>
                    <Form onSubmit={onGoalSettingsSubmit}>
                    <Col className='mb-3'>
                        <Row>
                        <Form.Group as={Col} id="formGridLast">
                            <Form.Check label="Apply last goal automatically" type="checkbox" name="last" checked={settings?.goal?.last || false} onChange={handleSettingsChange}/>
                        </Form.Group>
                        </Row>
                        <Row>
                        <Form.Group as={Col} id="formGridSearch">
                            <Form.Check label="Apply existing goal from the Ticket field" type="checkbox" name="search" checked={settings?.goal?.search || false} onChange={handleSettingsChange}/>
                        </Form.Group>
                        </Row>
                    </Col>
                    <div className="d-flex">
                        <Button type="submit" variant="primary">
                        Save settings
                        </Button>
                    </div>
                    </Form>
                </Container>
            </div>
            <hr/>
            <div>
                <Container>
                    <h5 className='mb-3'>Account</h5>
                    <Form onSubmit={onUserSubmit}>

                        <Row>
                            <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={user.name} readOnly />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEmail" >
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={user.email} readOnly />
                            </Form.Group>
                        </Row>

                        <Row>
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
                        </Row>

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