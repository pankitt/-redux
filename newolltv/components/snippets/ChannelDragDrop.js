import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ChannelDragDrop extends Component {
    static propTypes = {
        poster: PropTypes.string,
        nextThree: PropTypes.array,
    }
    render() {
        const { poster } = this.props;

        return (
            <div className="snippet channel-dnd">
                <div className="poster" style={{ backgroundImage:'url(' + poster + ')' }}></div>
                <div className="channel-dnd-content">
                    123
                </div>
            </div>
        );
    }
}
