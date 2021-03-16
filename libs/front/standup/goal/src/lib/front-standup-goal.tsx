import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import styles from  './front-standup-goal.module.scss';

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

/* eslint-disable-next-line */
export interface FrontStandupGoalProps {
  ticket: any;
  title: any;
  fnish: any;
  blocked: Boolean;
  details: any;
}

export function FrontStandupGoal(props: FrontStandupGoalProps) {

  const state = {
    goal: {
      ticket: props.ticket,
      title: props.title,
      finish: props.fnish,
      blocked: props.blocked,
      details: props.details
    }
  }


  // submit
  const [goal, setGoal] = useState({
    ticket: '',
    title: '',
    finish: '-1',
    blocked: false,
    details: ''
  })

  const handleChange = (event) => {
    if (event.target.name === 'blocked') {
      setGoal({...goal, [event.target.name]: event.target.value === 'on' })
    } else {
      setGoal({...goal, [event.target.name]: event.target.value })
    }
  }

  const onGoalSubmit = (event) => {
    event.preventDefault();

    console.log(goal);

    setLoading(true)
  }


  // Loading
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

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

            <Form.Row>
              <Form.Group as={Col} controlId="formGridTicket">
                <Form.Label>Ticket</Form.Label>
                <Form.Control type="text" value={state.goal.ticket} name="ticket" onChange={handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridTitle" >
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={state.goal.title} name="title" onChange={handleChange}/>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridFinish">
                <Form.Label>Finish</Form.Label>
                <Form.Control as="select" defaultValue="-1" name="finish" onChange={handleChange}>
                  <option value="-1">I do not know</option>
                  <option value="0">Today</option>
                  <option value="1">Tomorrow</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="4">4 days</option>
                  <option value="5">5 days</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} id="formGridBlocked">
                <Form.Check type="checkbox" label="Blocked" name="blocked" onChange={handleChange}/>
                <p className="text-secondary">I am prevented from reaching somewhere by someone or something</p>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridDetails">
                <Form.Label>Details</Form.Label>
                <Form.Control as="textarea" rows={2} value={state.goal.details} name="details" onChange={handleChange}/>
              </Form.Group>
            </Form.Row>

            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save'}
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default FrontStandupGoal;