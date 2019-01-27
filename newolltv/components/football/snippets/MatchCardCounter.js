import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import t from '../../i18n';

export default class MatchCardCounter extends Component {
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
    };

    timeToString(time) {
        const duration = moment.duration(time * 1000);
        return {
            d: duration.days(),
            h: duration.hours(),
            m: duration.minutes(),
            s: duration.seconds(),
        };
    }

    render() {
        return (
            <div className="counter">
                <p className="counter-title">{t('Match will start after')}</p>
                <div className="counter-details">
                    <span>{ this.state.d + ' ' }</span>{t('d')}
                    <span>{ this.state.h + ' ' }</span>{t('h')}
                    <span>{ this.state.m + ' ' }</span>{t('min')}
                    <span>{ this.state.s + ' ' }</span>{t('sec')}
                </div>
            </div>
        );
    }
}

MatchCardCounter.propTypes = {
    startTime: PropTypes.string,
};