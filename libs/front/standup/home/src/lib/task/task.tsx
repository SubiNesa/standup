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
            <Popover.Title as="h3">{props.goal.ticket}</Popover.Title>
            <Popover.Content>
                <Row >
                    <Col sm={1}><FontAwesomeIcon icon={["fas", "tasks"]} /></Col>
                    <Col>{props.goal.title}</Col>
                </Row>
                <Row >
                    <Col sm={1}><FontAwesomeIcon icon={["fas", "comments"]} /></Col>
                    <Col>{props.goal.details}</Col>
                </Row>
                <Row >
                    <Col sm={1}><FontAwesomeIcon icon={["fas", "flag-checkered"]} /></Col>
                    <Col>{props.goal.finish}</Col>
                </Row>
                {
                    props.goal.blocked ?
                    <Row >
                        <Col sm={1}><FontAwesomeIcon icon={["fas", "exclamation-triangle"]} /></Col>
                        <Col>{props.goal.blocked}</Col>
                    </Row>
                    : <span></span>
                }
                {
                    props.goal.previous && Array.isArray(props.goal.previous) ?
          
                        props.goal.previous.map((p, pIndex) => {
                            return <>
                                <hr></hr>
                                <Row >
                                    <Col sm={1}><FontAwesomeIcon icon={["fas", "tasks"]} /></Col>
                                    <Col>{p.title}</Col>
                                </Row>
                                <Row >
                                    <Col sm={1}><FontAwesomeIcon icon={["fas", "comments"]} /></Col>
                                    <Col>{p.details}</Col>
                                </Row>
                                <Row >
                                    <Col sm={1}><FontAwesomeIcon icon={["fas", "flag-checkered"]} /></Col>
                                    <Col>{p.finish}</Col>
                                </Row>
                            </>
                        })
                    : <span></span>
                }
            </Popover.Content>
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

    return (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip(props)}
            >
            <div style={setStyle()} ref={taskRef}>{props.goal.ticket}</div>
            

        </OverlayTrigger>              
    );
}

export default HomeTask;