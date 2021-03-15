import React, { useEffect, useRef } from 'react';

import styles from  './front-standup-home.module.scss';

import { Container, Row, Col, Table, Button, Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faClock, faExclamationTriangle, faTasks } from '@fortawesome/free-solid-svg-icons'
import HomeTask from './task/task';

/* eslint-disable-next-line */
export interface FrontStandupHomeProps {}

export function FrontStandupHome(props: FrontStandupHomeProps) {


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
            <Col ><h3>Activities viewer</h3></Col>
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
                  <tr>
                    <td className="align-middle">Thomas</td>
                    <td><HomeTask ticket="JIRA-12" icon="exclamation-triangle" days={2}/></td>
                    <td></td>
                    <td></td>
                    <td>
                      <HomeTask ticket="JIRA-14" icon="exclamation-triangle" days={1}/><br/>
                      <div style={badgeSep}></div>
                      <HomeTask ticket="JIRA-15" icon="exclamation-triangle" days={1}/><br/>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Max</td>
                    <td><HomeTask ticket="JIRA-17" icon="exclamation-triangle" days={4}/></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
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
