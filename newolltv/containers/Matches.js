import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Match from '../components/football/snippets/Match';
import map from 'lodash/map';
import { Link } from 'react-router-dom';
import { LIVE_STATUS_STOPPED, LIVE_STATUS_ENABLED, LIVE_STATUS_FINISHED, MATCHES_QUERY_FILTER_CLUBS, MATCHES_QUERY_FILTER_LEAGUES } from '../constants';
import { changeMatchesTimeFilter, MATCHES_IN_FUTURE, MATCHES_IN_PAST } from '../actions/football/matchesPage';
import { getClubMatches, getLeagueMatches, getMatches } from '../actions/football/matches';
import t from '../i18n';
import TeamFilter from '../components/football/snippets/TeamFilter';
import LeaguesFilter from '../components/football/snippets/LeaguesFilter';
import MatchesBlock from '../components/football/MatchesBlock';
import { getLongFormattedDate } from '../helpers/date-format';
import Button from '../components/Button';

class Matches extends Component {
    static propTypes = {
        matches: PropTypes.object,
        clubs: PropTypes.object,
        nationalTeams: PropTypes.object,
        leagues: PropTypes.object,
        matchesPage: PropTypes.object,
        location: PropTypes.object,
        topMatches: PropTypes.array,
        changeMatchesTimeFilter: PropTypes.func,
        getMatches: PropTypes.func,
        getClubMatches: PropTypes.func,
        getLeagueMatches: PropTypes.func,
        history: PropTypes.object,
        locale: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            showClubsPopup : false,
            showTournamentsPopup : false,
            teams: { ...props.clubs.items, ...props.nationalTeams.items },
            clubs: { ...props.clubs.items },
            nationalTeams: { ...props.nationalTeams.items },
            teamQuery: '',
        };

        this._getMatchesAccordingToQuery(props.location.search, 1);
    }

    setTitle() {
        const matchesPage = this.props.matchesPage;
        let filter = '';
        if (matchesPage.currentTournament && this.props.leagues.items[matchesPage.currentTournament]) {
            filter = ' - ' + this.props.leagues.items[matchesPage.currentTournament].title;
        }
        if (matchesPage.currentClub && this.state.teams[matchesPage.currentClub]) {
            filter = ' - ' + this.state.teams[matchesPage.currentClub].title;
        }
        document.title = 'OLL.TV ' + t('Football') + ' - ' + t('Matches') + filter;
    }

    _getMatchesAccordingToQuery = (search, page) => {
        const { getMatches, getLeagueMatches, getClubMatches, matchesPage } = this.props;
        const query = new URLSearchParams(search);
        const filter = query.get('filter'),
            id = parseInt(query.get('id'), 10);
        if (search.length) {
            switch (filter) {
                case MATCHES_QUERY_FILTER_CLUBS:
                    if (matchesPage.currentClub !== id || !matchesPage.matches.length || page > matchesPage.page) {
                        getClubMatches({ page, id });
                    }
                    break;
                case MATCHES_QUERY_FILTER_LEAGUES:
                    if (matchesPage.currentTournament !== id || !matchesPage.matches.length || page > matchesPage.page) {
                        getLeagueMatches({ page, id });
                    }
                    break;
                default:
                    this.props.history.push('/football');
            }
        } else if (!matchesPage.matches.length || matchesPage.currentClub || matchesPage.currentTournament || page > matchesPage.page) {
            getMatches({ page });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search || nextProps.locale !== this.props.locale) {
            setTimeout(() => this._getMatchesAccordingToQuery(nextProps.location.search, 1));
        }
        if (nextProps.clubs !== this.props.clubs) {
            this.setState({
                teams: { ...nextProps.clubs.items, ...nextProps.nationalTeams.items },
                clubs: { ...nextProps.clubs.items },
                nationalTeams: { ...nextProps.nationalTeams.items },
            });
        }
        if (nextProps.matchesPage !== this.props.matchesPage) {
            this.setTitle();
        }
    }

    setTimeFilter = filter => {
        const { changeMatchesTimeFilter, matchesPage: { timeFilter } } = this.props;
        if (filter === MATCHES_IN_FUTURE && timeFilter !== MATCHES_IN_FUTURE) {
            changeMatchesTimeFilter(MATCHES_IN_FUTURE);
        } else if (filter === MATCHES_IN_PAST && timeFilter !== MATCHES_IN_PAST) {
            changeMatchesTimeFilter(MATCHES_IN_PAST);
        }
    }

    showClubsPopup = () => {
        this.setState({ showClubsPopup : true }, () => {
            document.body.classList.add('ovh');
        });
    }

    showLeaguesPopup = () => {
        this.setState({ showTournamentsPopup : true }, () => {
            document.body.classList.add('ovh');
        });
    }

    _handleClosePopup = () => {
        this.setState({
            showClubsPopup : false,
            showTournamentsPopup : false,
        }, () => {
            document.body.classList.remove('ovh');
        });
    }

    _handleSeeMoreClick = () => {
        this._getMatchesAccordingToQuery(this.props.location.search, this.props.matchesPage.page + 1);
    }

    handlePopupItemClick(filter, id, teamQuery) {
        if (teamQuery !== undefined) {
            this.setState({ teamQuery });
        }
        if (id) {
            this.props.history.push('/football?filter=' + filter + '&id=' + id);
        } else {
            this.props.history.push('/football');
        }
        this._handleClosePopup();
    }

    getEmptyMatchesMessage(length, timeFilter, currentClub, currentTournament, error) {
        let message = error;
        let link;

        if (length) {
            return null;
        }
        if (timeFilter === MATCHES_IN_FUTURE) {
            message = t('Doesn`t have any matches for nearlest future.');
            if (currentClub && this.state.teams[currentClub]) {
                message = this.state.teams[currentClub].title + t(' - doesn`t have any matches for nearlest future. See');
            }
            if (currentTournament && this.props.leagues.items[currentTournament]) {
                message = this.props.leagues.items[currentTournament].title + t(' - doesn`t have any matches for nearlest future. See');
            }
            link = <span className="link" onClick={() => this.setTimeFilter(MATCHES_IN_PAST)}>{t('past matches')}</span>;
        }
        return <div className="no-matches">{message} {link}</div>;
    }

    render() {
        const { matchesPage, matchesPage: { timeFilter, currentTournament, currentClub, loading, error, hasMore }, matches, leagues } = this.props;

        const { teams, clubs, nationalTeams } = this.state;

        const liveMatches = [];
        let matchesGroupedByDate = {};
        for (let i in matchesPage.matches) {
            let match = matches[matchesPage.matches[i]];
            if (match.liveStatus === LIVE_STATUS_FINISHED && timeFilter === MATCHES_IN_PAST ||
                match.liveStatus === LIVE_STATUS_STOPPED && timeFilter === MATCHES_IN_FUTURE
            ) {
                let date = match.webStartData;
                if (typeof matchesGroupedByDate[date] === 'undefined') matchesGroupedByDate[date] = [];
                if (timeFilter === MATCHES_IN_PAST) {
                    matchesGroupedByDate[date].push(match);
                } else {
                    matchesGroupedByDate[date].unshift(match);
                }
            } else if (match.liveStatus === LIVE_STATUS_ENABLED) {
                liveMatches.push(match);
            }
        }

        const isFutureClassName = timeFilter === MATCHES_IN_FUTURE ? 'active' : '',
            isPastClassName = timeFilter !== MATCHES_IN_FUTURE ? 'active' : '';

        const isCurrentClubClassName = currentClub ? 'active' : '',
            isCurrentLeagueClassName = currentTournament ? 'active' : '';

        return (
            <div className="page-matches">
                <div className="matches-filter">
                    <h2 className="heading">{t('All matches')}</h2>
                    <ul className="matches-filter-primary tabs">
                        <li className={'tab-item ' + isFutureClassName} onClick={() => this.setTimeFilter(MATCHES_IN_FUTURE)}>{t('Future')}</li>
                        <li className={'tab-item ' + isPastClassName}  onClick={() => this.setTimeFilter(MATCHES_IN_PAST)}>{t('Past')}</li>
                    </ul>
                    <div className="matches-filter-secondary">
                        <Button isDefault
                            title={currentClub && teams[currentClub] ? teams[currentClub].title : t('Clubs and national teams')}
                            onClick={this.showClubsPopup}
                            customClassName={'popup-toggle clubs ' + isCurrentClubClassName}/>
                        <Button isDefault
                            title={currentTournament && leagues.items[currentTournament] ? leagues.items[currentTournament].title : t('Leagues')}
                            onClick={this.showLeaguesPopup}
                            customClassName={'popup-toggle leagues ' + isCurrentLeagueClassName}/>
                    </div>
                </div>
                <div className="matches">
                    { !loading ? this.getEmptyMatchesMessage(Object.keys(matchesGroupedByDate).length, timeFilter, currentClub, currentTournament, error) :
                        <MatchesBlock loading/> }
                    { map(timeFilter === MATCHES_IN_FUTURE ? Object.keys(matchesGroupedByDate).reverse() : Object.keys(matchesGroupedByDate),  date => {
                        const matches = matchesGroupedByDate[date];
                        return (
                            <MatchesBlock title={getLongFormattedDate(date, 'YYYY-MM-DD')} customTitleClassName="heading-small" key={date}>
                                {map(matches, match => {
                                    const highlightId = match.liveStatus === LIVE_STATUS_FINISHED && match.highlightId ? '/' + match.highlightId : '';
                                    return (
                                        <div className="col" key={match.id}>
                                            <Link to={'/football/' + match.id + highlightId}>
                                                <Match {...match} />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </MatchesBlock>
                        );
                    }) }
                    { timeFilter === MATCHES_IN_PAST && hasMore ?
                        <div className="tac">
                            <Button title={t('See more')} isDefault  onClick={this._handleSeeMoreClick} customClassName="load-more-btn"/>
                        </div> : null
                    }
                </div>
                {this.state.showClubsPopup ? <TeamFilter teams={teams} clubs={clubs} nationalTeams={nationalTeams} query={this.state.teamQuery} selectedId={currentClub} onClose={this._handleClosePopup} onSelect={(id, query) => this.handlePopupItemClick('club', id, query)}/> : null}
                {this.state.showTournamentsPopup ? <LeaguesFilter leagues={leagues.items} selectedId={currentTournament} onClose={this._handleClosePopup} onSelect={id => this.handlePopupItemClick('league', id)}/> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        matchesPage: state.football.matchesPage,
        topMatches: state.football.topMatches,
        matches: state.football.matches,
        leagues: state.football.leagues,
        clubs: state.football.clubs,
        nationalTeams: state.football.nationalTeams,
        locale: state.settings.locale,
    };
};

const mapDispatchToProps = {
    changeMatchesTimeFilter,
    getMatches,
    getLeagueMatches,
    getClubMatches,
};

export default connect(mapStateToProps, mapDispatchToProps, null)(Matches);
