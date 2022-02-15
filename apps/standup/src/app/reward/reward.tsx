import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  ProgressBar,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { useHistory } from 'react-router';

import styles from './../app.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBeer,
  faPizzaSlice,
  faMedal,
} from '@fortawesome/free-solid-svg-icons';

import Notifications from '../notifications';

/* eslint-disable-next-line */
export interface StandupRewardProps {}

import { environment } from '../../environments/environment';

export function StandupReward(props: StandupRewardProps) {
  const history = useHistory();

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer ' + localStorage.getItem('token')
          ? JSON.parse(localStorage.getItem('token'))
          : '',
    },
  };

  const [error, setError] = useState({
    display: false,
    message: '',
    title: '',
    status: null,
  });

  const [state, setStandUp] = useState({
    loading: false,
    rewards: [],
    animation: {
      key: '',
      icon: '',
      color: ''
    }
  });

  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setStandUp({ ...state, loading: true });

    fetch(`${environment.api}rewards`, requestOptions)
      .then((res) =>
        !res.ok ? history.push(`${environment.path}`) : res.json()
      )
      .then((rewards) => {
        setStandUp({ ...state, ...{ loading: false, rewards: rewards } });
      });
  }, []);

  const addDrinkTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add one drink
    </Tooltip>
  );
  const convertToPizzaTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Convert drinks to pizza
    </Tooltip>
  );
  const removeDrinkTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Remove one drink
    </Tooltip>
  );

  const saveReward = (data, action: string, animation: any) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + localStorage.getItem('token')
            ? JSON.parse(localStorage.getItem('token'))
            : '',
      },
    };

    fetch(`${environment.api}rewards/${data.id}/${action}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();

        // check for error response
        if (!response.ok) {
          setError({
            ...error, 
            ...{
              display: true,
              message: data.message || 'Action not authorized',
              status: data.statusCode,
              title: response.statusText || 'Unauthorized'
            },
          });
        } else {
          state.rewards.map((item) => {
            if (item.id === data.id) {
              item.rewards = data.rewards;
            }
            return item;
          });
          setVoted(true);
          setStandUp({
            ...state,
            ...{ loading: false, rewards: state.rewards, animation },
          });
        }
      })
      .catch((error) => {
        setError({ ...error, ...{ display: true, message: data.message } });
        console.error('There was an error!', error);
      });
  };

  const addDrink = (data, index) => {
    saveReward(data, 'add', {key: index, icon: faBeer, color: 'info'});
  };

  const addFood = (data, index) => {
    saveReward(data, 'convert', {key: index, icon: faPizzaSlice, color: 'warning'});
  };

  const removeDrink = (data, index) => {
    saveReward(data, 'remove', {key: index, icon: faMedal, color: 'success'});
  };

  return (
    <div className='reward'>
      <Notifications
        show={error.display}
        message={error.message}
        status={error.status}
        title={error.title}
        setShow={(display: boolean) => setError({ ...error, ...{ display } })}
      />
      <div className={styles.header}>
        <Container>
          <Row>
            <Col>
              <h3>Reward viewer</h3>
            </Col>
          </Row>
        </Container>
      </div>
      <div>
        <Container fluid>
          <Row className="text-end me-1 mb-2">
            <Col md={12} className="text-muted">
              <span className="m-2">
                3 <FontAwesomeIcon icon={faBeer} className="text-info" />
              </span>
              <span>=</span>
              <span className="m-2">
                1{' '}
                <FontAwesomeIcon icon={faPizzaSlice} className="text-warning" />
              </span>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Table hover className="align-middle">
                <tbody>
                  {state.rewards.map((item, index) => {
                    return (
                      <tr key={('item' + index).toString()}>
                        <td scope="col">
                          {item.name}
                        </td>
                        <td>
                          <ButtonAnimationReward index={index} animation={state.animation}></ButtonAnimationReward>
                          
                          <div>
                            <ProgressBar
                              variant="info"
                              now={item?.rewards?.drinks}
                              label={
                                item?.rewards?.drinks
                                  ? `${item?.rewards?.drinks}`
                                  : ''
                              }
                              className="progress"
                            />
                            <ProgressBar
                              variant="warning"
                              now={item?.rewards?.food}
                              label={
                                item?.rewards?.food
                                  ? `${item?.rewards?.food}`
                                  : ''
                              }
                              className="progress"
                            />
                          </div>
                        </td>
                        <td className="text-end reward-actions">
                          
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={addDrinkTooltip}
                          >
                            <Button
                              variant="outline-info"
                              onClick={() => addDrink(item, index)}
                              disabled={item.voted || voted}
                              className="reward-btn-circle"
                            >
                              <FontAwesomeIcon icon={faBeer} />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={convertToPizzaTooltip}
                          >
                            <Button
                              variant="outline-warning"
                              onClick={() => addFood(item, index)}
                              disabled={item.voted || voted}
                              className="ms-1 reward-btn-circle"
                            >
                              <FontAwesomeIcon icon={faPizzaSlice} />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={removeDrinkTooltip}
                          >
                            <Button
                              variant="outline-success"
                              onClick={() => removeDrink(item, index)}
                              disabled={item.voted || voted}
                              className="ms-1 reward-btn-circle"
                            >
                              <FontAwesomeIcon icon={faMedal} />
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

/**
 * Rewared animation once clicked on the button
 * @param props 
 */
function ButtonAnimationReward(props: any) {
  return (
     props.index === props.animation.key ? <>
    <div className={`reward-animation text-${props.animation.color}`}>
      <FontAwesomeIcon icon={props.animation.icon} />
    </div>
    </> : <></>
  )
}

export default StandupReward;
