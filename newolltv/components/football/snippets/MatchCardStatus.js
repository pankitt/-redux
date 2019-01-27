import React from 'react';
import PropTypes from 'prop-types';
import MatchCardCounter from './MatchCardCounter';
import t from '../../i18n';

import {
    LIVE_STATUS_ENABLED,
    LIVE_STATUS_STOPPED
} from '../../constants';

export default function MatchCardStatus(props) {
    let footTemplate, diff;
    switch (props.liveStatus) {
        case LIVE_STATUS_ENABLED:
            footTemplate = <button className="btn match-card-btn">{t('Watch match')}</button>;
            break;
        case LIVE_STATUS_STOPPED:
            diff = props.webStartTS ? props.webStartTS - Date.now() : 0;
            if (diff > 0) {
                footTemplate = <MatchCardCounter startTime={props.webStartTS}/>;
            }
            break;
    }

    return (
        <div className="match-body-foot ">
            {footTemplate}
        </div>
    );
}

MatchCardStatus.propTypes = {
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
};
