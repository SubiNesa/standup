import { faExclamationCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';

/* eslint-disable-next-line */
export interface Notifications {
  show: boolean;
  title: string;
  message: string;
  status: number;
  setShow: any;
}

export function Notifications(props: Notifications) {
  const icons = {
    403: faExclamationCircle,
    404: faSearch,
  };

  return (
    <>
      <ToastContainer className="p-3" position="top-end">
        <Toast
          onClose={() => props.setShow(false)}
          show={props.show}
          delay={3000}
          autohide
          className="border-danger"
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto text-danger">
              <FontAwesomeIcon icon={icons[props.status]} className="me-2" />{' '}
              {props.title}
            </strong>
            <small></small>
          </Toast.Header>
          <Toast.Body>{props.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default Notifications;
