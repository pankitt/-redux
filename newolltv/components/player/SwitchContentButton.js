import React from 'react';
import PropTypes from 'prop-types';

export default function SwitchContentButton(props) {
    let className = 'player-switch-content arrow-' + (props.prev ? 'left' : 'right');
    return <div className={className} onClick={props.onClick}>{props.title}</div>;
}

SwitchContentButton.defaultProps = {
    prev: false,
};

SwitchContentButton.propTypes = {
    title: PropTypes.string.isRequired,
    prev: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};