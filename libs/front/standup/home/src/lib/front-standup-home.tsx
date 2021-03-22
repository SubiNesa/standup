import React, { CSSProperties, useEffect, useState } from 'react';

import styles from  './front-standup-home.module.scss';

import { Container, Row, Col, Table, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import HomeTask from './task/task';

/* eslint-disable-next-line */
export interface FrontStandupHomeProps {}

export function FrontStandupHome(props: FrontStandupHomeProps) {
  
  const dates = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getMonday = (d) => {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  // Create table from monday to friday
  const buildWeekTable = (date = new Date()) => {
    console.log('buildWeekTable', date);
    for (let index = 0; index < 5; index++) {
      const d = new Date(getMonday(date));
      d.setDate(d.getDate() + index);
      dates.push({ day: days[index], date: `${d.getDate()}.${(d.getMonth() + 1)}`});
    }
  }
  
  const [state, setStandUp] = useState({
    loading: false,
    monday: getMonday(new Date()),
    goals: [],
  });
  
  buildWeekTable(state.monday);

  useEffect(() => {
    setStandUp({ ...state, loading: true });
    const apiUrl = `/api/goals/${state.monday.getFullYear()}-${(state.monday.getMonth() + 1)}-${state.monday.getDate()}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((goals) => {
        setStandUp({...state, ...{ loading: false, goals: goals}});
      });
  }, [state.monday]);

  const onChangeDates = (days) => {
    const monday = getMonday(state.monday);
    const date = new Date(monday.setDate(monday.getDate() + days))
    setStandUp({...state,  ...{ monday: date, goals: [] }});
  }


  const navigationButtons: CSSProperties = {
   'marginBottom': '15px'
  }
  const badgeSep: CSSProperties = {
   'marginBottom': '5px'
  }
  const td: CSSProperties = {
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
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={onChangeDates.bind(this, -7)} 
                disabled={state.loading}> <FontAwesomeIcon icon={faArrowLeft} /> </Button> 
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={onChangeDates.bind(this, 7)} 
                disabled={state.loading}
                className="ml-2"> <FontAwesomeIcon icon={faArrowRight} /> </Button>
            </Col>
          </Row>
          <Row>
            
            <Col md={12}>
              <Table bordered >
                <tbody>
                  <tr>
                    <td>
                    { 
                      state.loading ? <Spinner animation="border" variant="primary" size="sm"/> : <></>
                    }
                    </td>
                    {
                      dates.map((d, dIndex) => {
                        return <td style={td} key={('d' + dIndex).toString()}>{d.day} {d.date}</td>
                      })
                    }
                  </tr>
                  {
                    state.goals.map((item, index) =>{
                      return <tr key={('item' + index).toString()}><td>{item.user}</td>
                      
                      {
                        item.data.map((goals, tdKey) => {
                          if (goals && Array.isArray(goals)) {
                              return <td key={('goals' + tdKey).toString()}>
                              {
                                goals.map((goal, sectionId) => {
                                  if (goal && goal.ticket) {
                                    return <section key={('goal' + sectionId).toString()}>
                                      <HomeTask goal={goal} color={item.color}/>
                                        <br/>
                                        <div style={badgeSep}></div>
                                      </section>
                                  } else {
                                    return <section key={('goal' + sectionId).toString()}><br/><div style={badgeSep}></div></section>
                                  }
                                })
                              }</td>
                          }
                          return <td key={('goals' + tdKey).toString()}></td>
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
