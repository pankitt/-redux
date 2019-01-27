import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import t from '../../../i18n';

export default class Timer extends Component {
    static propTypes = {
        startTime: PropTypes.string,
        cover: PropTypes.string,
    }
    constructor(props) {
        super(props);
        const diff = Math.ceil((props.startTime - Date.now()) / 1000);
        const interval = diff > 0 && setInterval(this.tick, 1000);
        this.state = {
            diff,
            ...this.timeToString(diff),
            interval,
        };
    }
    tick = () => {
        const diff = this.state.diff - 1;
        if (diff < 0) {
            clearInterval(this.state.interval);
        } else {
            this.setState({ diff, ...this.timeToString(diff) });
        }
    }
    timeToString(time) {
        const duration = moment.duration(time * 1000);
        return {
            d: duration.days(),
            h: duration.hours(),
            m: duration.minutes(),
        };
    }
    componentWillUnmount() {
        clearInterval(this.state.interval);
    }
    getTimeToStart() {
        return (
            <div>
                {this.state.h ? <span>{`${this.state.h} ${t('h')}`}</span> : null}
                <span>{`${this.state.m} ${t('min')}`}</span>
            </div>
        );
    }
    render() {
        const { cover, startTime } = this.props;
        return (
            <div className="counter children-middle" style={{ backgroundImage: 'url(' + cover + ')' }}>
                <p className="counter-title">{t('left before match')}</p>
                <div className="counter-details">
                    {this.state.d ? moment(startTime).toNow(true) : this.getTimeToStart()}
                </div>
            </div>
        );
    }
}
