import React, { useEffect, useRef, useState } from 'react';

import styles from  './front-standup-home.module.scss';

import { Container, Row, Col, Table, Button, Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faClock, faExclamationTriangle, faTasks } from '@fortawesome/free-solid-svg-icons'
import HomeTask from './task/task';

/* eslint-disable-next-line */
export interface FrontStandupHomeProps {}

export function FrontStandupHome(props: FrontStandupHomeProps) {
  
  const [state, setStandUp] = useState({
    loading: false,
    goals: [],
  });

  useEffect(() => {
    setStandUp({ ...state, loading: true });
    const apiUrl = `/api/goals`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((goals) => {
        setStandUp({ loading: false, goals: goals });
      });
  }, [setStandUp]);

  const navigationButtons = {
   'marginBottom': '15px'
  }
  const badgeSep = {
   'marginBottom': '5px'
  }
  const td = {
   'width': '17%'
  }

  return (
    <div>
      <div className={styles.header}>
        <Container>
          <Row >
            <Col ><h3>Goals viewer</h3></Col>
          </Row>
        </Container>
      </div>
      <div>
        <Container fluid>
          <Row style={navigationButtons} className="text-right">
            <Col md={12}>
              <Button variant="outline-secondary" size="sm"> <FontAwesomeIcon icon={faArrowLeft} /> </Button>{' '}  
              <Button variant="outline-secondary" size="sm"> <FontAwesomeIcon icon={faArrowRight} /> </Button>{' '}  
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Table bordered >
                <tbody>
                  <tr>
                    <td></td>
                    <td style={td}>Monday</td>
                    <td style={td}>Tuesday</td>
                    <td style={td}>Wednesday</td>
                    <td style={td}>Thursday</td>
                    <td style={td}>Friday</td>
                  </tr>
                  {
                    state.goals.map((item, index) =>{
                      return <tr key={index}><td>{item.user}</td>
                      
                      {
                        item.data.map((goals, tdKey) => {
                          if (goals && Array.isArray(goals)) {
                              return <td key={tdKey}>
                              {
                                goals.map((goal, sectionId) => {
                                  if (goal && goal.ticket) {
                                    return <section key={sectionId}>
                                      <HomeTask goal={goal} color={item.color}/>
                                        <br/>
                                        <div style={badgeSep}></div>
                                      </section>
                                  } else {
                                    return <section key={sectionId}><br/><div style={badgeSep}></div></section>
                                  }
                                })
                              }</td>
                          }
                          return <td></td>
                        })
                      }
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

export default FrontStandupHome;
