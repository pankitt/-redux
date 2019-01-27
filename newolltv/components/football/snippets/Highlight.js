import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../../../i18n';
export default class Highlight extends Component {
    static propTypes = {
        highlight: PropTypes.object,
        isOnFocus: PropTypes.bool,
        isPlaying: PropTypes.bool,
        withMatchDesc: PropTypes.bool,
        match: PropTypes.object,
        showViewPercentage: PropTypes.bool,
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.highlight.id === this.props.highlight.id;
    }

    render() {
        const { isOnFocus, withMatchDesc, isPlaying } = this.props;
        const { id, cover, title, marker, duration, viewPercentage } = this.props.highlight;
        let className = 'snippet highlight';
        className += withMatchDesc ? ' with-details' : '';
        className += isOnFocus ? ' focus' : '';
        className += isPlaying ? ' pause' : '';

        let seekTimeProgressBar = !this.props.showViewPercentage ? null : (
            <div className="seek-time-progress-bar">
                <div style={{ width: viewPercentage + '%' }}/>
            </div>
        );

        return (
            <div className={className} id={id}>
                <div className="highlight-main" style={{ backgroundImage: 'url(' + cover + ')' }} key="h">
                    <div className="title">{title}</div>
                    <div className="play-btn"/>
                    <div className={ 'marker-football ' + marker }>{ marker && t(marker) }</div>
                    <div className="duration">{duration}</div>
                </div>
                {withMatchDesc && <HighlightMatch match={this.props.match} key="m"/>}
                {seekTimeProgressBar}
            </div>
        );
    }
}

function HighlightMatch(props) {
    const { homeTeam, homeTeamLogo, homeTeamScored, awayTeam, awayTeamLogo, awayTeamScored, webStartDayMonthShort, tournamentName } = props.match;
    return (
        <div className="highlight-details">
            <div className="team home">
                <div className="name">{homeTeam}</div>
                <img src={homeTeamLogo} alt=""/>
            </div>
            <div className="details">
                <div className="tournament">{tournamentName}</div>
                <div className="date">{webStartDayMonthShort}</div>
                <div className="score">
                    <span>{homeTeamScored}</span>
                    <span>–</span>
                    <span>{awayTeamScored}</span>
                </div>
            </div>
            <div className="team away">
                <img src={awayTeamLogo} alt=""/>
                <div className="name">{awayTeam}</div>
            </div>
        </div>
    );
}

HighlightMatch.propTypes = {
    match: PropTypes.object,
};
