import React from 'react';
import PropTypes from 'prop-types';
// import NotifyItem from './NotifyItem';
import EpgMarker from './EpgMarker';
import EpgProgressBar from './EpgProgressBar';

export default function EpgItem(props) {
    const onClick = props.isLive || props.hasRecord ? props.onClick : null;
    return (
        <div id={props.id} className={'program' + (onClick ? ' with-action' : '') + (props.active ? ' active' : '')} onClick={onClick}>
            <div className="time">{props.startTime}</div>
            <EpgMarker hasRecord={props.hasRecord} isLive={props.isLive}/>
            <div className="title">{props.title}</div>
            {/* <NotifyItem/>*/}
            {props.isLive ? <EpgProgressBar start={props.start} stop={props.stop}/> : null}
        </div>
    );
}

EpgItem.propTypes = {
    id: PropTypes.number.isRequired,
    startTime: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isLive: PropTypes.bool.isRequired,
    hasRecord: PropTypes.bool.isRequired,
    start: PropTypes.number.isRequired,
    stop: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
};
