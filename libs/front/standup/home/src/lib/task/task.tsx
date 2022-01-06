import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import { Row, Col, OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


/* eslint-disable-next-line */
export interface HomeTask {
    goal: any;
    color: string;
}


export function HomeTask(props: HomeTask) {

const taskRef = useRef();

const displayDays = (day) => {
    if (day === -1) {
        return 'I do not know';
    } else if (day === 0) {
        return 'Today';
    } else if (day === 1) {
        return 'Tomorrow';
    } else if (day > 1) {
        return `${day} days`;
    }
}

const useResize = (myRef) => {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    
    useEffect(() => {
        const handleResize = () => {
            setWidth(myRef.current.parentElement.parentElement.offsetWidth)
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
            <Popover.Header as="h3">{props.goal.ticket}</Popover.Header>
            <Popover.Body>
                <Row >
                    <Col sm={1}><FontAwesomeIcon icon={["fas", "bullseye"]} /></Col>
                    <Col>{props.goal.title}</Col>
                </Row>
                <Row >
                    <Col sm={1}><FontAwesomeIcon icon={["fas", "comments"]} /></Col>
                    <Col>{props.goal.details}</Col>
                </Row>
                <Row >
                    <Col sm={1}><FontAwesomeIcon icon={["fas", "flag-checkered"]} /></Col>
                    <Col>{displayDays(props.goal.finish)}</Col>
                </Row>
                {
                    props.goal.blocked ?
                    <Row >
                        <Col sm={1}><FontAwesomeIcon icon={["fas", "exclamation-triangle"]} /></Col>
                        <Col>Blocked</Col>
                    </Row>
                    : <span></span>
                }
                {
                    props.goal.previous && Array.isArray(props.goal.previous) ?
          
                        props.goal.previous.map((p, pIndex) => {
                            return <div key={pIndex}>
                                <hr></hr>
                                <Row >
                                    <Col sm={1}><FontAwesomeIcon icon={["fas", "bullseye"]} /></Col>
                                    <Col>{p.title}</Col>
                                </Row>
                                <Row >
                                    <Col sm={1}><FontAwesomeIcon icon={["fas", "comments"]} /></Col>
                                    <Col>{p.details}</Col>
                                </Row>
                                <Row >
                                    <Col sm={1}><FontAwesomeIcon icon={["fas", "flag-checkered"]} /></Col>
                                    <Col>{displayDays(p.finish)}</Col>
                                </Row>
                                {
                                    p.blocked ?
                                    <Row >
                                        <Col sm={1}><FontAwesomeIcon icon={["fas", "exclamation-triangle"]} /></Col>
                                        <Col>Blocked</Col>
                                    </Row>
                                    : <span></span>
                                }
                            </div>
                        })
                    : <span></span>
                }
            </Popover.Body>
        </Popover>
    );


    const setStyle = (): CSSProperties  => {
        return {
            'position': 'absolute',
            'borderRadius': '.25rem',
            'padding': '0.1em 0.4em',
            'backgroundColor': `#${props.color}`,
            'color': '#fff',
            'width': (width * (props?.goal?.days ? props.goal.days : 1) - 24)
        };
    }

    const renderBlocked = (goal) => {
        if (goal.blocked) {
            return <FontAwesomeIcon className="mr-2" icon={["fas", "exclamation-triangle"]} /> 
        } 
    }

    return (
        <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(props)}
            >
            <div style={setStyle()} ref={taskRef}>
                {renderBlocked(props.goal)}
                {props.goal.ticket}
                <span className="float-end">{displayDays(props.goal.finish)}</span>
            </div>
            

        </OverlayTrigger>              
    );
}

export default HomeTask;