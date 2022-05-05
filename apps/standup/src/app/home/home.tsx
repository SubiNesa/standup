import React, { CSSProperties, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Form,
} from 'react-bootstrap';

import styles from './../app.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCalendarWeek,
} from '@fortawesome/free-solid-svg-icons';

import HomeTask from './task';
import CommentsTask from './comments';
import UtilsDates from '../../../../../libs/utils/dates';

/* eslint-disable-next-line */
export interface StandupHomeProps {}

import { environment } from '../../environments/environment';
import useToken from '../token';
import Notifications from '../notifications';

export function StandupHome(props: StandupHomeProps) {
  const utilsDates = new UtilsDates();

  const { token, setToken } = useToken();

  // refresh page after update of data
  const [refreshKey, setRefreshKey] = useState(0);

  const [showComments, setShowComments] = useState({
    show: false,
    goal: null
  });

  const [notification, setNotification] = useState({
    display: false,
    message: '',
    title: '',
    status: null,
  });

  const handleNotification = (data) => setNotification(data);
  const handleCloseComments = () => setShowComments({show: false, goal: null});
  const handleShowComments = (goal) => setShowComments({show: true, goal: goal});
  const onShowComments = (goal) => {
    if (goal) {
      handleShowComments(goal);
    }
  }

  const dates = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Create table from monday to friday
  const buildWeekTable = (date = new Date()) => {
    for (let index = 0; index < 5; index++) {
      const d = new Date(utilsDates.getMonday(date));
      d.setDate(d.getDate() + index);
      dates.push({
        day: days[index],
        date: `${d.getDate()}.${d.getMonth() + 1}`,
      });
    }
  };

  const [state, setStandUp] = useState({
    loading: false,
    monday: utilsDates.getMonday(new Date()),
    filters: {},
    goals: [],
  });

  buildWeekTable(state.monday);

  useEffect(() => {
    console.log('useEffect');
    console.log(state);
    setStandUp({ ...state, loading: true });

    let apiUrl = `${environment.api}goals?from=${utilsDates.getFormatDate(
      state.monday,
      '-'
    )}`;
    if (Object.keys(state.filters).length > 0) {
      let filters = '';
      Object.keys(state.filters).forEach((key, index) => {
        filters += `&${key}=${state.filters[key]}`;
      });
      apiUrl += filters;
    }

    fetch(apiUrl)
      .then((res) => res.json())
      .then((goals) => {
        setStandUp({ ...state, ...{ loading: false, goals: goals } });
      });
  }, [state.monday, state.filters, refreshKey]);

  const onChangeDates = (days) => {
    const monday =
      days === 0
        ? utilsDates.getMonday(new Date())
        : utilsDates.getMonday(state.monday);
    const date = new Date(monday.setDate(monday.getDate() + days));
    setStandUp({ ...state, ...{ monday: date, goals: [] } });
  };

  const onChangeFilters = (event) => {
    state.filters = {
      ...state.filters,
      ...{ [event.target.name]: event.target.checked },
    };
    setStandUp({ ...state, ...{ filters: state.filters, goals: [] } });
  };

  const handleUpdate = () => {
    setRefreshKey(oldKey => oldKey +1)
  };

  const navigationButtons: CSSProperties = {
    marginBottom: '15px',
  };
  const badgeSep: CSSProperties = {
    marginBottom: '5px',
  };
  const td: CSSProperties = {
    width: '17%',
  };

  return (
    <div>
      <Notifications
        show={notification.display}
        message={notification.message}
        status={notification.status}
        title={notification.title}
        setShow={(display: boolean) => setNotification({ ...notification, ...{ display } })}
      />
      <div className={styles.header}>
        <Container>
          <Row>
            <Col md={11}>
              <h3>Goals viewer</h3>
            </Col>
            {token ? (
              <>
                <Col className="text-end">
                  <Button
                    variant="outline-success"
                    size="sm"
                    href={`${environment.path}goal`}
                  >
                    Create
                  </Button>
                </Col>
              </>
            ) : (
              ''
            )}
          </Row>
        </Container>
      </div>
      <div>
        <Container fluid>
          <Row style={navigationButtons} className="text-end">
            <Col md={10}>
              <Form>
                <Form.Check
                  inline
                  type="checkbox"
                  id="front"
                  label="Frontend"
                  name="front"
                  onClick={onChangeFilters}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  id="back"
                  label="Backend"
                  name="back"
                  onClick={onChangeFilters}
                />
              </Form>
            </Col>
            <Col md={2}>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onChangeDates.bind(this, -7)}
                disabled={state.loading}
              >
                {' '}
                <FontAwesomeIcon icon={faArrowLeft} />{' '}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onChangeDates.bind(this, 0)}
                className="ms-2"
                disabled={state.loading}
              >
                {' '}
                <FontAwesomeIcon icon={faCalendarWeek} />{' '}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={onChangeDates.bind(this, 7)}
                disabled={state.loading}
                className="ms-2"
              >
                {' '}
                <FontAwesomeIcon icon={faArrowRight} />{' '}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Table bordered>
                <tbody>
                  <tr>
                    <td>
                      {state.loading ? (
                        <Spinner
                          animation="border"
                          variant="primary"
                          size="sm"
                        />
                      ) : (
                        <></>
                      )}
                    </td>
                    {dates.map((d, dIndex) => {
                      return (
                        <td style={td} key={('d' + dIndex).toString()}>
                          {d.day} {d.date}
                        </td>
                      );
                    })}
                  </tr>
                  {state.goals.map((item, index) => {
                    return (
                      <tr key={('item' + index).toString()}>
                        <td>{item.user}</td>

                        {item.data.map((goals, tdKey) => {
                          if (goals && Array.isArray(goals)) {
                            return (
                              <td key={('goals' + tdKey).toString()}>
                                {goals.map((goal, sectionId) => {
                                  if (goal && goal.ticket) {
                                    return (
                                      <section
                                        key={('goal' + sectionId).toString()}
                                      >
                                        <HomeTask
                                          goal={goal}
                                          color={item.color}
                                          showComments={onShowComments.bind(this, goal)}
                                        />
                                        <br />
                                        <div style={badgeSep}></div>
                                      </section>
                                    );
                                  } else {
                                    return (
                                      <section
                                        key={('goal' + sectionId).toString()}
                                      >
                                        <br />
                                        <div style={badgeSep}></div>
                                      </section>
                                    );
                                  }
                                })}
                              </td>
                            );
                          }
                          return <td key={('goals' + tdKey).toString()}></td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
      <CommentsTask
        comment={showComments}
        handleNotification={handleNotification}
        handleClose={handleCloseComments}
        handleUpdate={handleUpdate}
      ></CommentsTask>
    </div>
  );
}

export default StandupHome;
