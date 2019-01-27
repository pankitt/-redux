import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {} from 'history';
import MatchStatus from './MatchStatus';
import { LIVE_STATUS_ENABLED, MATCH_NOT_STARTED } from '../../../constants';

export default class Match extends Component {
    static propTypes = {
        tournamentName: PropTypes.string,
        roundName: PropTypes.string,
        homeTeam: PropTypes.string,
        homeTeamLogo: PropTypes.string,
        homeTeamScored: PropTypes.string,
        awayTeam: PropTypes.string,
        awayTeamLogo: PropTypes.string,
        awayTeamScored: PropTypes.string,
        startedAt: PropTypes.number,
        customClassName: PropTypes.string,
        isLarge: PropTypes.bool,
        isCard: PropTypes.bool,
        webStartHour: PropTypes.string,
        webStartMinute: PropTypes.string,
        webStartDayMonthShort: PropTypes.string,
        webStartTS: PropTypes.number,
        statusId: PropTypes.number,
        liveStatus: PropTypes.string,
        matchPosterLarge: PropTypes.string,
        webStart: PropTypes.string,
        liveTypeId: PropTypes.string,
    }
    onClick = () => {

    }
    render() {
        const { tournamentName, roundName, homeTeam, homeTeamLogo, awayTeam, awayTeamLogo, isLarge,
            customClassName, startedAt, webStartTS, webStartHour, webStartMinute, webStartDayMonthShort, homeTeamScored,
            awayTeamScored, statusId, liveStatus, isCard, matchPosterLarge, liveTypeId,
        } = this.props;

        const isLargeClassName = isLarge ? 'large' : '',
            isCardClassName = isCard ? 'card' : '';

        const backgroundImageLarge = isLarge && matchPosterLarge ? matchPosterLarge : '';
        const isLiveClassName = liveStatus === LIVE_STATUS_ENABLED && statusId !== MATCH_NOT_STARTED ? 'live' : '';
        return (
            <div
                className={ 'snippet match ' + isLargeClassName + ' ' + isCardClassName + ' ' + customClassName + ' ' + isLiveClassName }
                onClick={this.onClick}
                style={{ backgroundImage: 'url(' + backgroundImageLarge + ')' }}
                itemProp="broadcastOfEvent"
                itemScope
                itemType="http://schema.org/SportsEvent"
            >
                {+liveTypeId === 14 ? <div className="match-icons">
                    <i className="ic-noCommentator" />
                    <i className="ic-SD" />
                </div> : null}
                <h1 className="match-head">
                    <span className="tournament" itemProp="name">{ tournamentName }</span>
                    <span>{ roundName }</span>
                </h1>
                <div className="match-body">
                    <div className="match-body-left" key="l" itemProp="competitor" itemScope itemType="http://schema.org/SportsTeam">
                        <div className="name" itemProp="name">{ homeTeam }</div>
                        <div className="logo">
                            <img src={ homeTeamLogo } alt="" />
                        </div>
                    </div>
                    <MatchStatus {...{ startedAt, webStartHour, webStartMinute, webStartDayMonthShort, homeTeamScored, awayTeamScored, statusId, liveStatus, webStartTS, liveTypeId }} key="c"/>
                    <div className="match-body-right" key="r" itemProp="competitor" itemScope itemType="http://schema.org/SportsTeam">
                        <div className="logo">
                            <img src={ awayTeamLogo } alt=""/>
                        </div>
                        <div className="name" itemProp="name">{ awayTeam }</div>
                    </div>
                </div>
                <meta itemProp="startDate" content={this.props.webStart} />
            </div>
        );
    }
}
