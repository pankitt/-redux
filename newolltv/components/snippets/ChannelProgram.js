import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import EpgMarker from '../channels/EpgMarker';

export default class ChannelProgram extends Component {
    static propTypes = {
        poster: PropTypes.string,
        nextThree: PropTypes.array,
        link: PropTypes.string,
        startTime: PropTypes.number,
        id: PropTypes.number,
        title: PropTypes.string,
        currentProgramId: PropTypes.number,
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.nextThree === this.props.nextThree || nextProps.currentProgramId !== this.props.currentProgramId;
    }
    render() {
        const { poster, link, startTime, id, title, currentProgramId } = this.props;
        return (
            <div className="snippet channel channel-program">
                {link ? <Link to={link} style={{ width: '100%' }}>
                    <div className="poster" style={{ backgroundImage:'url(' + poster + ')' }}/>
                </Link> : <div className="poster" style={{ backgroundImage:'url(' + poster + ')' }}/>}
                <div className="epg">
                    <div className="epg-item">
                        <div className="time">{startTime}</div>
                        <EpgMarker isLive={id === currentProgramId} />
                        <div className="title">{title}</div>
                    </div>
                </div>
            </div>
        );
    }
}
