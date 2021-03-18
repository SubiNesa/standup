import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import styles from './../front-standup-admin.module.scss';

export function UsersCreate(props: any) {
    const history = useHistory();
    let { id } = useParams();

    // loading
    const [isLoading, setLoading] = useState(false);
    // user
    const [user, setUser] = useState({
        name: '',
        email: '',
        roles: [],
        teams: []
    });

    if (id) {
        useEffect(() => {
            fetch(`/api/users/${id}`)
              .then((res) => res.json())
              .then((user) => {
                setUser({ ...user, ...user });
              });
        }, [setUser]);
    }
    
    const handleChange = (event) => {
        if (event.target.name === 'teams' || event.target.name === 'roles') {
            let data = [];
            if (event.target.checked) {
                data = [...user[event.target.name], event.target.value]
            } else {
                let index = user[event.target.name].indexOf(event.target.value);
                if (index > -1) {
                    user[event.target.name].splice(index, 1);
                }
                data = user[event.target.name];
            }
            setUser({...user, [event.target.name]: data});
        } else {
            setUser({...user, [event.target.name]: event.target.value });
        }
    }

    const saveUser = (data) => {
        setLoading(true);

        if (data._id) {
            delete data._id;
        }
        
        const requestOptions = {
          method: id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        };

        const api = id ? `/api/users/${id}` : '/api/users';
        
        fetch(api, requestOptions)
          .then(async response => {
              const data = await response.json();
    
              setLoading(false);
    
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  const error = (data && data.message) || response.status;
                  return Promise.reject(error);
              } else {
                history.push("/admin");
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
                        <Col><h3>Admin • {id ? 'Edit' : 'Add' } User</h3></Col>
                    </Row>
                </Container>
            </div>
            <div>
                <Container>
                    <Form onSubmit={onUserSubmit}>

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={user.name} onChange={handleChange}/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridEmail" >
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={user.email} onChange={handleChange}/>
                            </Form.Group>
                        </Form.Row>

                        <Row>
                            <Col>
                                <p>Roles</p>
                                <Form.Row>
                                    <Form.Group as={Col} id="formGridroles">
                                        <Form.Check type="checkbox" label="Developer" name="roles" value="developer" checked={user.roles.includes('developer')} onChange={handleChange}/>
                                        <Form.Control.Feedback type="valid">- add goals</Form.Control.Feedback>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} id="formGridAdmin">
                                        <Form.Check type="checkbox" label="Admin" name="roles" value="admin" checked={user.roles.includes('admin')} onChange={handleChange}/>
                                    </Form.Group>
                                </Form.Row>
                            </Col>
                            <Col>
                                <p>Team</p>
                                <Form.Row>
                                    <Form.Group as={Col} id="formGridFront">
                                        <Form.Check label="Frontend" type="checkbox" name="teams" value="frontend" checked={user.teams.includes('frontend')} onChange={handleChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} id="formGridBackend">
                                        <Form.Check label="Backend" type="checkbox" name="teams" value="backend" checked={user.teams.includes('backend')} onChange={handleChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} id="formGridDesign">
                                        <Form.Check label="Design" type="checkbox" name="teams" value="design" checked={user.teams.includes('design')} onChange={handleChange}/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} id="formGridOthers">
                                        <Form.Check label="Others" type="checkbox" name="teams" value="others" checked={user.teams.includes('others')} onChange={handleChange}/>
                                    </Form.Group>
                                </Form.Row>
                            </Col>
                        </Row>
                        <Button variant={id ? 'info' : 'primary'} type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving…' : 'Save'}
                        </Button>
                    </Form>
                </Container>
            </div>
        </div>           
    );
}

export default UsersCreate;