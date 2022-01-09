import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap';

import styles from  './front-standup-goal.module.scss';

import { environment } from '../../../../../../apps/standup/src/environments/environment';


/* eslint-disable-next-line */
export interface FrontStandupGoalProps {
  ticket: any;
  title: any;
  fnish: any;
  blocked: Boolean;
  details: any;
}

export function FrontStandupGoal(props: FrontStandupGoalProps) {

  const history = useHistory();

  const requestOptions = {
    method: 'GET',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''
    }
  };

  const search = (query: any) => {
    fetch(`${environment.api}goals/search?${query.key}=${query.value}`, requestOptions)
      .then((res) =>  !res.ok ? history.push(`${environment.path}`) : res.json())
      .then((goal) => {
        setGoal({ ...goal, ...goal });
      }); 
  }

  // alert for settings
  const [showAlert, setShowAlert] = useState(true);
  // loading
  const [isLoading, setLoading] = useState(false);
  // submit
  const [goal, setGoal] = useState({
    ticket: '',
    title: '',
    finish: '-1',
    blocked: false,
    details: ''
  });

  useEffect(() => {
    fetch(`${environment.api}goals/last`, requestOptions)
      .then((res) =>  !res.ok ? history.push(`${environment.path}`) : res.json())
      .then((goal) => {
        if (Object.keys(goal).length !== 0 && goal.constructor === Object) {
          setGoal({ ...goal, ...goal });
        }
      });
  }, [setGoal]);  

  const handleBlur = (event) => {
    search({key: event.target.name, value: event.target.value});
  }

  const handleChange = (event) => {
    if (event.target.name === 'blocked') {
      setGoal({...goal, [event.target.name]: event.target.value === 'on' })
    } else {
      setGoal({...goal, [event.target.name]: event.target.value })
    }
  }

  const saveGoal = (data) => {
    setLoading(true);
    
    const requestOptions = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''},
      body: JSON.stringify(data)
    };
    
    fetch(`${environment.api}goals`, requestOptions)
      .then(async response => {
          const data = await response.json();

          setLoading(false);

          // check for error response
          if (!response.ok) {
              const error = (data && data.message) || response.status;
              console.log(error);
          } else {
            history.push(`${environment.path}home`);
          }

      })
      .catch(error => {
          setLoading(false);
          // this.setState({ errorMessage: error.toString() });
          console.error('There was an error!', error);
      });
  }

  const onGoalSubmit = (event) => {
    event.preventDefault();
    saveGoal(goal);
  }

  const resetForm = (event) => {
    event.preventDefault();
    setGoal({
      ticket: '',
      title: '',
      finish: '-1',
      blocked: false,
      details: ''
    });
  }

  return (
    <div>
      <div className={styles.header}>
        <Container>
          <Row>
            <Col ><h3>Add goal</h3></Col>
          </Row>
        </Container>
      </div>
      <div>
        <Container>
          <Form onSubmit={onGoalSubmit}>

            <Row className='mb-3'>
              <Form.Group as={Col} controlId="formGridTicket">
                <Form.Label>Ticket</Form.Label>
                <Form.Control type="text" value={goal.ticket} name="ticket" onBlur={handleBlur} onChange={handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridTitle" >
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={goal.title} name="title" onChange={handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridFinish">
                <Form.Label>Finish</Form.Label>
                <Form.Control as="select" value={goal?.finish.toString() !== '0' ? (Number(goal?.finish) - 1).toString() : goal?.finish} name="finish" onChange={handleChange}>
                  <option value="-1">I do not know</option>
                  <option value="0">Today</option>
                  <option value="1">Tomorrow</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                </Form.Control>
              </Form.Group>
            </Row>

            <Row className='mb-3'>
              <Form.Group as={Col} id="formGridBlocked">
                <Form.Check type="checkbox" checked={goal.blocked} label="Blocked" name="blocked" onChange={handleChange}/>
                <p className="text-secondary">I am prevented from reaching somewhere by someone or something</p>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridDetails">
                <Form.Label>Details</Form.Label>
                <Form.Control as="textarea" rows={2} value={goal.details} name="details" onChange={handleChange}/>
              </Form.Group>
            </Row>

            <Button variant="light" onClick={resetForm}>Reset</Button>
            <Button variant="primary" className="ms-3" type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save'}
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default FrontStandupGoal;
