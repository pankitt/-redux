import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { Link } from 'react-router-dom';
import EpgMarker from '../channels/EpgMarker';

export default class Channel extends Component {
    static propTypes = {
        poster: PropTypes.string,
        nextThree: PropTypes.array,
        link: PropTypes.string,
        currentProgramId: PropTypes.number,
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.nextThree === this.props.nextThree || nextProps.currentProgramId !== this.props.currentProgramId;
    }
    render() {
        const { poster, link, nextThree, currentProgramId } = this.props;

        return (
            <div className="snippet channel">
                {link ? <Link to={link} style={{ width: '100%' }}>
                    <div className="poster" style={{ backgroundImage:'url(' + poster + ')' }}/>
                </Link> : <div className="poster" style={{ backgroundImage:'url(' + poster + ')' }}/>}
                <div className="epg">
                    {map(nextThree.slice(0, 3), (program, i) => {
                        return (
                            <div className="epg-item" key={i}>
                                <div className="time">{program.startTime}</div>
                                <EpgMarker isLive={program.id === currentProgramId} />
                                <div className="title">{program.title}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
