import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Container, Row, Col, Button, Form, Alert, Modal } from 'react-bootstrap';

import styles from './../front-standup-admin.module.scss';

import { environment } from '../../../../../../../apps/standup/src/environments/environment';

export function UsersCreate(props: any) {
    const history = useHistory();
    const params: any = useParams();

    const [alert, setAlert] = useState("");
    const [userDeleteData, setUserDeleteText] = useState({
        text: ''
    });
    //modal
    const [modalShow, setDeleteModalShow] = useState(false);
    // loading
    const [isLoading, setLoading] = useState(false);
    // user
    const [user, setUser] = useState({
        name: '',
        email: '',
        deleted: true,
        roles: [],
        teams: [],
        projects: []
    });

    if (params?.id) {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''
            }
        };

        useEffect(() => {
            fetch(`${environment.api}users/one/${params.id}`, requestOptions)
              .then((res) =>  !res.ok ? history.push(`${environment.path}`) : res.json())
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
        } else if (event.target.name === 'projects') {
            setUser({...user, [event.target.name]: event.target.value.split(',').map((item) => item.trim()) });
        } else {
            setUser({...user, [event.target.name]: event.target.value });
        }
    }

    const onUserSubmit = (event) => {
        event.preventDefault();
        console.log(userDeleteData);
        saveUser(user);
    }

    const saveUser = (data) => {
        setLoading(true);

        if (data._id) {
            delete data._id;
        }

        if (!params.id) {
            data.password = '12345';
        }
        
        const requestOptions = {
            method: params.id ? 'PUT' : 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''
            },
            body: JSON.stringify(data)
        };

        const api = params.id ? (
            user.deleted ? 
            `${environment.api}users/one/${params.id}/restore` : 
            `${environment.api}users/one/${params.id}`
            ) : `${environment.api}users/one`;
        
        fetch(api, requestOptions)
          .then(async response => {
              const data = await response.json();
    
              setLoading(false);
    
              // check for error response
              if (!response.ok) {
                setAlert(data.message);
              } else {
                history.push(`${environment.path}admin`);
              }
          })
          .catch(error => {
              setLoading(false);
              console.error('There was an error!', error);
          });
    }

    const onUserDelete = (event) => {
        event.preventDefault();
        userDelete(event.target[1].value === user.name);
    }

    const userDelete = (toDelete) => {

        if (!toDelete) {
            return;
        }
        
        setLoading(true);

        const requestOptions = {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''
            }
        };

        fetch(`${environment.api}users/one/${params.id}`, requestOptions)
          .then(async response => {
              const data = await response.json();
    
              setLoading(false);
    
              // check for error response
              if (!response.ok) {
                setAlert(data.message);
              } else {
                history.push(`${environment.path}admin`);
              }
          })
          .catch(error => {
              setLoading(false);
              console.error('There was an error!', error);
          });
    }

    function DeleteUserModal(props) {
        return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            animation={false}
        >
            <Form onSubmit={onUserDelete}>
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete user
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>
                    In order to delete, please type the name of the user
                </p>
                <Row>
                    <Col>
                        <Form.Control type="text" name="delete" placeholder={user?.name ? user.name : ''}/>
                    </Col>
                </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-primary' onClick={props.onHide}>Close</Button>
                    <Button variant='danger' type="submit" disabled={isLoading}>Delete</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        );
      }

    return (        
        <div>
            <div className={styles.header}>
                <Container>
                    <Row>
                        <Col><h3>Admin • {params.id ? 'Edit' : 'Add' } User</h3></Col>
                    </Row>
                </Container>
            </div>
            <div>
                <Container>
                    {
                        alert ? 
                        <Row>
                            <Alert className="w-100" variant="warning">{alert}</Alert>
                        </Row>
                        : <></>        
                    }
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

                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridProjects">
                                <Form.Label>Projects</Form.Label>
                                <Form.Control type="text" name="projects" value={user.projects} onChange={handleChange}/>
                            </Form.Group>

                            <Col>
                                <p>Roles</p>
                                <Form.Row>
                                    <Form.Group as={Col} id="formGridroles">
                                        <Form.Check type="checkbox" label="Developer" name="roles" value="developer" checked={user?.roles && user?.roles.includes('developer')} onChange={handleChange}/>
                                        <Form.Control.Feedback type="valid">- add goals</Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col} id="formGridAdmin">
                                        <Form.Check type="checkbox" label="Admin" name="roles" value="admin" checked={user?.roles && user?.roles.includes('admin')} onChange={handleChange}/>
                                    </Form.Group>
                                </Form.Row>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col md={6}></Col>
                            <Col md={6}>
                                <p>Team</p>
                                <Form.Row>
                                    <Form.Group as={Col} id="formGridFront">
                                        <Form.Check label="Frontend" type="checkbox" name="teams" value="frontend" checked={user?.teams && user?.teams.includes('frontend')} onChange={handleChange}/>
                                    </Form.Group>
                                
                                    <Form.Group as={Col} id="formGridBackend">
                                        <Form.Check label="Backend" type="checkbox" name="teams" value="backend" checked={user?.teams && user?.teams.includes('backend')} onChange={handleChange}/>
                                    </Form.Group>
                                
                                    <Form.Group as={Col} id="formGridDesign">
                                        <Form.Check label="Design" type="checkbox" name="teams" value="design" checked={user?.teams && user?.teams.includes('design')} onChange={handleChange}/>
                                    </Form.Group>
                                
                                    <Form.Group as={Col} id="formGridOthers">
                                        <Form.Check label="Others" type="checkbox" name="teams" value="others" checked={user?.teams && user?.teams.includes('others')} onChange={handleChange}/>
                                    </Form.Group>
                                </Form.Row>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col md={2}>

                                <Button variant={params.id ? (user.deleted ? 'outline-warning' : 'outline-primary') : 'primary'} type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving…' :  (user.deleted ? 'Restore' : 'Save')}
                                </Button>
                            </Col>
                            <Col md={10}>
                                {
                                    (params?.id && !user.deleted) ?
                                        <Button variant='outline-danger' type="button" disabled={isLoading} onClick={() => setDeleteModalShow(true)}>
                                        Delete {user?.name ? user.name : 'user'}
                                        </Button>
                                        : <></>
                                }
                            </Col>
                        </Form.Row>
                    </Form>
                </Container>
            </div>

            <DeleteUserModal
                show={modalShow}
                onHide={() => setDeleteModalShow(false)}
            />
        </div>
    );
}

export default UsersCreate;