import React from 'react';
import PropTypes from 'prop-types';

export default function EpgMarker(props) {
    if (props.isLive) {
        return <div className="marker live"/>;
    }
    if (props.hasRecord) {
        return <div className="marker"/>;
    }
    return null;
}

EpgMarker.propTypes = {
    hasRecord: PropTypes.number.isRequired,
    isLive: PropTypes.bool.isRequired,
};