import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

import { Container, Row, Col, Table, Button  } from 'react-bootstrap';

import styles from './../front-standup-admin.module.scss';

export function UsersList(props: any) {

    const [data, setData] = useState({
        loading: false,
        users: [],
      });
    
      useEffect(() => {
        setData({ ...data, loading: true });
        const apiUrl = `/api/users/`;
        fetch(apiUrl)
          .then((res) => res.json())
          .then((users) => {
            setData({ loading: false, users: users });
          });
      }, [setData]);
    

    return (        
        <div>
            <div className={styles.header}>
                <Container>
                    <Row>
                        <Col><h3>Admin • Users viewer</h3></Col>
                    </Row>
                </Container>
            </div>
            <div>
                <Container fluid>
                    <Row className="text-right mb-3">
                        <Col md={12}>
                            <Button variant="outline-secondary" href="/admin/user">Add user</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Roles</th>
                                        <th>Teams</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.users.map((user, index) => {
                                            return <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user?.roles && user.roles.join(', ')}</td>
                                                <td>{user?.teams && user.teams.join(', ')}</td>
                                                <td>
                                                    <Button variant="outline-primary" href={'/admin/user/' + user._id}><FontAwesomeIcon icon={["fas", "edit"]} /></Button>
                                                    <Button variant="outline-danger" className="ml-2"><FontAwesomeIcon icon={["fas", "trash-alt"]} /></Button>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>           
    );
}

export default UsersList;