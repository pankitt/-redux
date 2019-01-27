import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Subtitles extends Component {
    static propTypes = {
        currentTime: PropTypes.number.isRequired,
        subtitle: PropTypes.array,
    };

    render() {
        // console.log(this.props.currentTime, this.props.subtitle);
        return <div className="player-subtitles">Nobody exists on purpose. Nobody belongs anywhere. Everybody`s gonna die. Come watch TV</div>;
    }
}

export default Subtitles;
