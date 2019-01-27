import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../../../i18n';
import moment from 'moment';

import {
    MATCH_NOT_STARTED,
    MATCH_FIRST_HALF,
    MATRH_SECOND_HALF,
    MATCH_HALFTIME,
    MATCH_AWAITING_EXTRA_TIME,
    MATCH_EXTRA_TIME_HALFTIME,
    MATCH_AWAITING_PENALTIES,
    MATCH_FIRST_EXTRA_TIME,
    MATCH_SECOND_EXTRA_TIME,
    MATCH_PENALTIES,
    MATCH_ENDED,
    LIVE_STATUS_FINISHED,
    LIVE_STATUS_ENABLED,
    LIVE_STATUS_STOPPED,
} from '../../../constants';

export default function MatchStatus(props) {
    let className, date, time, score;
    switch (props.liveStatus) {
        case LIVE_STATUS_FINISHED:
            className = 'past';
            date = <div className="date" key="d">{props.webStartDayMonthShort}</div>;
            score = <div className="score" key="s"><span>{props.homeTeamScored}</span><span>–</span><span>{props.awayTeamScored}</span></div>;
            break;
        case LIVE_STATUS_ENABLED:

            if (props.statusId === MATCH_NOT_STARTED) {
                className = 'today';
                date = <div className="marker-football">{t('Today')}</div>;
                time = <div className="time"><span>{props.webStartHour}</span><span>:</span><span>{props.webStartMinute}</span></div>;
            } else {
                className = 'live';
                date = <div className="marker-football">{t('Live')}</div>;
                score = <div className="score"><span>{props.homeTeamScored}</span><span>–</span><span>{props.awayTeamScored}</span></div>;
                time = <div className="live-time">{getPeriodTime(props.startedAt, props.statusId)}</div>;
            }

            break;
        case LIVE_STATUS_STOPPED:
            if (moment(props.webStartTS).isSame(Date.now(), 'day')) {
                className = 'today';
                date =  <div className="marker-football">{t('Today')}</div>;
            } else {
                className = 'future';
                date = <div className="date" key="d">{props.webStartDayMonthShort}</div>;
            }
            time = <div className="time"><span>{props.webStartHour}</span><span>:</span><span>{props.webStartMinute}</span></div>;
            break;
    }
    return (
        <div className={'match-body-middle ' + className}>
            {date}
            {score}
            {time}
        </div>
    );
}

MatchStatus.propTypes = {
    liveStatus: PropTypes.string,
    statusId: PropTypes.number,
    webStart: PropTypes.string,
    webStartTS: PropTypes.number,
    homeTeamScored: PropTypes.string,
    awayTeamScored: PropTypes.string,
    webStartHour: PropTypes.string,
    webStartMinute: PropTypes.string,
    webStartDayMonthShort: PropTypes.string,
    startedAt: PropTypes.number,
    today: PropTypes.number,
};

function getPeriodTime(startedAt, status) {
    let start, stop;
    switch (status) {
        case MATCH_NOT_STARTED:
        case MATCH_ENDED:
            return '';
        case MATCH_FIRST_HALF:
            start =  1;
            stop = 45;
            break;
        case MATCH_HALFTIME:
            start =  45;
            stop = 45;
            break;
        case MATRH_SECOND_HALF:
            start =  46;
            stop = 90;
            break;
        case MATCH_AWAITING_EXTRA_TIME:
        case MATCH_FIRST_EXTRA_TIME:
        case MATCH_EXTRA_TIME_HALFTIME:
            start =  91;
            stop = 105;
            break;
        case MATCH_AWAITING_PENALTIES:
        case MATCH_SECOND_EXTRA_TIME:
        case MATCH_PENALTIES:
            start =  106;
            stop = 120;
            break;
        default:
            return 0;
    }
    start += Math.round((Date.now() - startedAt) / 60000);
    return <MatchPeriodTime start={start} stop={stop} status={status} key={status}/>;
}

class MatchPeriodTime extends Component {
    static propTypes = {
        start: PropTypes.number,
        stop: PropTypes.number,
        status: PropTypes.number,
    }
    constructor(props) {
        super(props);
        this.state = {
            time:  Math.min(props.start, props.stop),
        };

        if (props.start < props.stop) {
            if (props.stop - props.start) {
                this.updateTimeInterval = setInterval(() => {
                    let time = this.state.time + 1;
                    this.setState({ time });
                    if (time >= this.props.stop) {
                        clearInterval(this.updateTimeInterval);
                        this.updateTimeInterval = null;
                    }
                }, 60000);
            }
        }
    }
    componentWillUnmount() {
        if (this.updateTimeInterval) {
            clearInterval(this.updateTimeInterval);
        }
    }
    render() {
        // const { status } = this.props;
        // const { time } = this.state;

        // const position = time / 90 * 100;
        // let timeClassName = '';
        // if (time < 10) {
        //     timeClassName = 'to-left';
        // } else if (time > 80) {
        //     timeClassName = 'to-right';
        // }
        let timeText;
        switch (this.props.status) {
            case MATCH_HALFTIME:
            case MATCH_AWAITING_EXTRA_TIME:
            case MATCH_EXTRA_TIME_HALFTIME:
            case MATCH_AWAITING_PENALTIES:
                timeText = t('Halftime');
                break;
            case MATCH_PENALTIES:
                timeText = t('Penalties');
                break;
            default:
                timeText = this.state.time + ' ' + t('min');
        }
        return (
            // <div className="progress progress-match" style={{ width: position + '%' }}>
            //     <div className={'time ' + timeClassName}>{status === MATCH_HALFTIME ? t('Halftime') : time + ' ' + t('min')}</div>
            // </div>
            <span className="current-time">{timeText}</span>
        );
    }
}
