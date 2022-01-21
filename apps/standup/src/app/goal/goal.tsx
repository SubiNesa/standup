import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap';

import styles from  './../app.module.scss';

import { environment } from '../../environments/environment';


/* eslint-disable-next-line */
export interface StandupGoalProps {
  ticket: any;
  title: any;
  fnish: any;
  blocked: Boolean;
  details: any;
}

export function StandupGoal(props: StandupGoalProps) {

  const history = useHistory();

  const requestOptions = {
    method: 'GET',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : ''
    }
  };

  // alert for settings
  const [showAlert, setShowAlert] = useState(false);
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
  // settings
  const [settings, setSettings] = useState({
    goal: {
      last: undefined,
      search: undefined
    }
  });

  // get search
  const search = (query: any) => {
    if (settings.goal.search) {
      fetch(`${environment.api}goals/search?${query.key}=${query.value}`, requestOptions)
      .then((res) =>  !res.ok ? history.push(`${environment.path}`) : res.json())
      .then((data) => {
        if (data.ticket) {
          setGoal({ ...goal, ...data });
        }
      }); 
    }
  }  

  // get settings
  useEffect(() => {
    fetch(`${environment.api}users/me/settings`, requestOptions)
      .then((res) =>  !res.ok ? history.push(`${environment.path}`) : res.json())
      .then((data) => {
      if (!data.settings.goal || Object.keys(data.settings.goal).length === 0) {
        setShowAlert(true);
        setSettings({ ...settings, ...{
          goal: {
            last: true,
            search: true
          }
        }});
      } else {
        setSettings({ ...settings, ...data.settings });
      }
    })
  }, []);

  // Get the latest
  useEffect(() => {
    if (settings.goal.last) {
      fetch(`${environment.api}goals/last`, requestOptions)
        .then((res) =>  !res.ok ? history.push(`${environment.path}`) : res.json())
        .then((data) => {
          	if (Object.keys(data).length !== 0 && data.constructor === Object) {
              if (data?.finish > 0) {
                data.finish = data.finish - 1;
              } 
        	}
			setGoal({ ...goal, ...data });
		})
    }
  }, [settings]);

  const handleBlur = (event) => {
    search({key: event.target.name, value: event.target.value});
  }

  const handleChange = (event) => {
    if (event.target.name === 'blocked') {
      setGoal({...goal, [event.target.name]: event.target.checked });
    } else {
      setGoal({...goal, [event.target.name]: event.target.value });
    }
  }
  
  const handleSettingsChange = (event) => {
    const data = { ... settings};
    data.goal[event.target.name] = event.target.checked;
    setSettings(data);
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
            setShowAlert(false);
          }

      })
      .catch(error => {
          console.error('There was an error!', error);
      });
  }

  const onGoalSubmit = (event) => {
    event.preventDefault();
    saveGoal(goal);
  }

  const onGoalSettingsSubmit = (event) => {
    event.preventDefault();
    saveUserSettings(settings);
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
          <Alert show={showAlert} variant="warning">
            <Alert.Heading>How's it going?!</Alert.Heading>
            <p>
              We've noticed missing settings! You can chose ...
            </p>
            <ul> 
              <li>if the latest goal should be taken automatically, do not worry you can always reset the form</li>
              <li>if the goal should be searched after blur the Ticket field</li>
            </ul>
            <hr />
            <Form onSubmit={onGoalSettingsSubmit}>
              <Col>
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
              <div className="d-flex justify-content-end">
                <Button type="submit" variant="outline-success">
                  Save my settings
                </Button>
              </div>
            </Form>
          </Alert>
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
                <Form.Control as="select" value={goal?.finish} name="finish" onChange={handleChange}>
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

export default StandupGoal;
