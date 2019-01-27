import React from 'react';
import PropTypes from 'prop-types';
import EpgMarker from './EpgMarker';

export default function ProgramInfo(props) {
    return (
        <div className="player-program">
            <EpgMarker hasRecord={props.dvr === 1 || (props.dvr === -1 && props.stop < Date.now())} isLive={props.isLive}/>
            <div className="player-program-title">{props.title}</div>
            <h1 className="dn">{props.currentChannel}</h1>
        </div>
    );
}

ProgramInfo.propTypes = {
    stop: PropTypes.number.isRequired,
    dvr: PropTypes.number.isRequired,
    title: PropTypes.string,
    isLive: PropTypes.bool,
    currentChannel: PropTypes.string,
};