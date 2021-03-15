import React, { ForwardedRef, ReactNode, useEffect, useRef, useState } from 'react';

import styles from  './home-task.module.scss';

import { Row, Col, Badge, OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


/* eslint-disable-next-line */
export interface HomeTask {
    ticket: ReactNode;
    icon: ReactNode;
    days: number;
}


export function HomeTask(props: HomeTask) {

const taskRef = useRef();

const useResize = (myRef) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    
    useEffect(() => {
        const handleResize = () => {
        setWidth(myRef.current.parentElement.offsetWidth)
        setHeight(myRef.current.offsetHeight)
        }

        handleResize();
    
        window.addEventListener('resize', handleResize)
    
        return () => {
        window.removeEventListener('resize', handleResize)
        }
    }, [myRef])
    
    return { width, height }
    }

    const { width, height } = useResize(taskRef);

    const renderTooltip = (props) => (
        <Popover id="popover-basic" {...props}>
        <Popover.Title as="h3">JIRA-17</Popover.Title>
        <Popover.Content>
            <Row >
                <Col sm={1}><FontAwesomeIcon icon={["fas", "tasks"]} /></Col>
                <Col>Refactoring the old cold</Col>
            </Row>
            <Row >
                <Col sm={1}><FontAwesomeIcon icon={["fas", "clock"]} /></Col>
                <Col>Tommorow</Col>
            </Row>
            <Row >
                <Col sm={1}><FontAwesomeIcon icon={["fas", "exclamation-triangle"]} /></Col>
                <Col>Blocked</Col>
            </Row>
        </Popover.Content>
        </Popover>
    );


    const setStyle = () => {
        return {
            'position': 'absolute',
            'borderRadius': '.25rem',
            'padding': '0.1em 0.4em',
            'backgroundColor': '#28a745',
            'color': '#fff',
            'width': (width * (props.days ? props.days : 1) - 24)
        };
    }

    return (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
            >
            <div style={setStyle()} ref={taskRef}>{props.ticket}</div>
            

        </OverlayTrigger>              
    );
}

export default HomeTask;