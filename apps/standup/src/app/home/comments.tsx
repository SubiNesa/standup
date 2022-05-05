import React, { CSSProperties } from 'react';
import { useHistory } from 'react-router-dom';

import { Form, Button, Modal } from 'react-bootstrap';

import { environment } from '../../environments/environment';

/* eslint-disable-next-line */
export interface CommentsTask {
  comment: any;
  handleNotification: any;
  handleClose: any;
  handleUpdate: any;
}

export function CommentsTask(props: CommentsTask) {
  const history = useHistory();

  const setStyle = (): CSSProperties => {
    return {
      overflowY: 'auto',
      height: '200px',
      marginBottom: '15px',
    };
  };

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

  const saveComment = (event) => {
    event.preventDefault();

    if (event.target.comment.value) {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + localStorage.getItem('token')
              ? JSON.parse(localStorage.getItem('token'))
              : '',
        },
        body: JSON.stringify({'comment': event.target.comment.value}),
      };

      fetch(
        `${environment.api}goals/${props?.comment.goal['_id']}/comment`,
        requestOptions
      )
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            props.handleNotification({
              message: data.statusCode === 403 ? 'Not authorized to save the comment on this ticket' : data.message,
              title: response.statusText || 'Unauthorized',
              status: data.statusCode
            })
            //setAlert(data.message);
          } else {
            props.handleUpdate();
          }
          props.handleClose();
        })
        .catch((error) => {
          //setLoading(false);
          console.error('There was an error!', error);
        });
    }
  };

  return (
    <>
      <Modal
        show={props.comment.show}
        onHide={props.handleClose}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Form onSubmit={saveComment}>
          <Modal.Header closeButton>
            <Modal.Title>{props.comment?.goal?.ticket} Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={setStyle()}>
              {props?.comment?.goal &&
                props.comment.goal.comments &&
                [...props.comment.goal.comments]
                  .reverse()
                  .map((data, index) => {
                    return (
                      <fieldset key={index}>
                        <legend>
                          {new Date(data.date).toLocaleDateString()}{' '}
                          {new Date(data.date).toLocaleTimeString()}
                        </legend>
                        <p className="m-2">{data.comment}</p>
                      </fieldset>
                    );
                  })}
              {props?.comment?.goal?.previous &&
                props.comment.goal.previous.length > 0 &&
                props.comment.goal.previous.map((data, key) => {
                  return (
                    <div key={key + 20}>
                      {data.comments &&
                        data.comments.length > 0 &&
                        [...data.comments].reverse().map((comment, index) => {
                          return (
                            <fieldset key={index + 30}>
                              <legend>
                                {' '}
                                {new Date(
                                  comment.date
                                ).toLocaleDateString()}{' '}
                                {new Date(comment.date).toLocaleTimeString()}
                              </legend>
                              <p className="m-2">{comment.comment}</p>
                            </fieldset>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>New comment</Form.Label>
              <Form.Control as="textarea" rows={3} name="comment" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default CommentsTask;
