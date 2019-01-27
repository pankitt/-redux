import React, { Component } from 'react';
import { connect } from 'react-redux';
import t from '../i18n';
import PropTypes from 'prop-types';
import getMain from '../actions/football/main';
import { getMatch } from '../actions/football/matches';
import Carousel from '../components/carousel/Carousel';
import map from 'lodash/map';
import Highlight from '../components/football/snippets/Highlight';
import Lineups from '../components/football/snippets/Lineups';
import TournamentTable from '../components/football/snippets/TournamentTable';
import MatchDetails from '../components/football/Player/MatchDetails';
import { Link } from 'react-router-dom';
import Player from '../components/football/Player/Player';
// import Timer from '../components/football/Player/Timer';
import { getTournamentTable, getCupTree } from '../actions/football/match';
import { LIVE_STATUS_ENABLED, LIVE_STATUS_FINISHED } from '../constants';
import Error from '../components/Error';
import { clearMeta, addMeta } from '../helpers/metaTags';

class FootballMatch extends Component {
    static propTypes = {
        locale: PropTypes.string,
        history: PropTypes.object,
        auth: PropTypes.object,
        id: PropTypes.number.isRequired,
        highlightId: PropTypes.number,
        match: PropTypes.object,
        highlights: PropTypes.object,
        getMain: PropTypes.func.isRequired,
        getMatch: PropTypes.func.isRequired,
        getTournamentTable: PropTypes.func.isRequired,
        matchPage: PropTypes.object,
        topMatches: PropTypes.array,
    }
    constructor(props) {
        super(props);
        const { match, getMatch, id } = props;
        this.state = {
            tournamentList: null,
            cupList: null,
        };
        if (!match) {
            setTimeout(getMatch, 0, id);
        }
    }

    redirectToHighlight = () => {
        if (this.props.match && this.props.match.liveStatus === LIVE_STATUS_FINISHED && !this.props.highlightId && this.props.match.highlights.length) {
            this.props.history.replace('/football/' + this.props.match.id + '/' + (this.props.match.highlightId || this.props.match.highlights[0]));
        }
    }

    setTitle(match, highlight) {
        const title = highlight ? highlight.title : `${match.homeTeam} - ${match.awayTeam} ${match.tournamentName}`;
        const description = highlight ? `${title}. ${t('')} ` : `${title} `;
        document.title = title;
        addMeta(
            {
                description,
                keywords: `${match.homeTeam}, ${match.awayTeam}, ${match.tournamentName}, ${t('meta_football_match_keywords')}`,
            },
            {
                title,
                description,
                type: 'video.other',
                url: window.location.href,
                image: highlight ? highlight.cover : match.tournamentPlayerImage || '',
            }
        );
    }
    componentDidMount() {
        if (!this.props.topMatches || !this.props.topMatches.length) {
            this.props.getMain();
        }
        if (this.props.match && this.props.match.id) {
            this.setTitle(this.props.match, this.props.highlights[this.props.highlightId]);
        }
        if (this.props.match) {
            this.redirectToHighlight();
            this.props.getTournamentTable(this.props.match.subtournamentId || this.props.match.tournamentId);
        }
        clearMeta();
    }

    switchToLive = () => {
        if (this.props.highlightId && this.props.match.liveStatus === LIVE_STATUS_ENABLED) {
            this.props.history.replace('/football/' + this.props.id);
        }
    }

    componentDidUpdate(prevProps) {
        const { id, match, locale } = this.props;
        if (locale !== prevProps.locale) {
            setTimeout(this.props.getMatch, 0, id);
        }
        if (match && (!prevProps.match || prevProps.match.id !== match.id)) {
            this.redirectToHighlight();
            this.props.getTournamentTable(match.subtournamentId || match.tournamentId);
            // this.props.getCupTree(this.props.match.subtournamentId);
        }
        if (prevProps.match !== this.props.match || prevProps.highlightId !== this.props.highlightId) {
            this.setTitle(this.props.match, this.props.highlights[this.props.highlightId]);
        }
    }

    // getSchema() {
    //     const match = this.props.match;
    //     return {
    //         '@context': 'http://schema.org',
    //         '@type': 'BroadcastEvent',
    //         'name': match.tournamentName,
    //         'description': `${match.tournamentName}. ${t('Match')} ${match.homeTeam} - ${match.awayTeam}`,
    //         'isLiveBroadcast': 'http://schema.org/True',
    //         'videoFormat': 'HD',
    //         'startDate': match.webStart,
    //         'broadcastOfEvent': {
    //             '@type': 'SportsEvent',
    //             'name': match.tournamentName,
    //             'competitor': {
    //                 'homeTeam': {
    //                     '@type': 'SportsTeam',
    //                     'name': match.homeTeam,
    //                     'logo': match.homeTeamLogo,
    //                 },
    //                 'awayTeam': {
    //                     '@type': 'SportsTeam',
    //                     'name': match.awayTeam,
    //                     'logo': match.awayTeamLogo,
    //                 },
    //             },
    //             'startDate': match.webStart,
    //         },
    //     };
    // }

    render() {
        const { highlights, match, highlightId, id, matchPage } = this.props;

        if (matchPage && matchPage.isLoading) return <div className="loading"/>;
        if (!match || id === 0) return <Error {...{ code: 400 }}/>;

        const tournamentTable = this.props.matchPage && this.props.matchPage.tournamentTable ? this.props.matchPage.tournamentTable : {};

        return (
            <div className="page-football-match with-payer-block" itemScope itemType="http://schema.org/BroadcastEvent">
                <meta itemProp="isLiveBroadcast" content="http://schema.org/True" />
                <meta itemProp="startDate" content={match.webStart} />
                <meta itemProp="videoFormat" content="HD" />
                {/* <div className="close-btn" onClick={() => this.props.history.goBack()}/> */}
                <div className="match-content">
                    <Player match={match} highlightId={highlightId} switchToLive={this.switchToLive} history={this.props.history}/>
                    <MatchDetails match={match}/>
                </div>
                <div className="match-details">
                    {match.highlights && match.highlights.length ?
                        <div className="highlights">
                            <div className="container">
                                <h2 className="heading">{t('Highlights')}</h2>
                                <Carousel gridClassName="grid cols-5@xxl cols-5@xl cols-4@l cols-2@s cols-1@xs">
                                    {map(match.highlights, id => {
                                        const highlight = highlights[id];
                                        const activeClassName = id === highlightId ? 'active' : '';
                                        return (
                                            <Link className={'carousel-item highlight col ' + activeClassName} key={id} to={'/football/' + match.id + '/' + id}>
                                                <Highlight highlight={highlight} match={match} />
                                            </Link>
                                        );
                                    })}
                                </Carousel>
                            </div>
                        </div>
                        : <div className="no-highlights">
                            <span className="icon" />{t('There will be match highlights')}
                        </div>
                    }

                    {match.lineups && match.lineups.homeTeam && match.lineups.homeTeam.length ? <div className="container">
                        <div className="lineups">
                            <Lineups {...match} locale={this.props.locale} />
                        </div>
                    </div> : null}
                    { Object.keys(tournamentTable.items).length > 0 ? <div className="tournament-table">
                        <TournamentTable {...match} tournamentTable={tournamentTable.items} />
                    </div> : null }
                </div>
                {/* <script type="application/ld+json">*/}
                {/* {JSON.stringify(this.getSchema())}*/}
                {/* </script>*/}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let id, highlightId;
    if (ownProps.match.params.id) {
        id = parseInt(ownProps.match.params.id, 10);
        if (isNaN(id)) {
            return { id: 0 };
        }
    }
    const match = state.football.matches[id];

    if (ownProps.match.params.highlightId) {
        highlightId = parseInt(ownProps.match.params.highlightId, 10);
        if (highlightId.isNaN || !match || !match.highlights || match.highlights.indexOf(highlightId) === -1) {
            highlightId = 0;
        }
    }

    return {
        id,
        highlightId,
        match,
        auth: state.auth,
        highlights: state.football.highlights,
        topMatches: state.football.mainPage.topMatches,
        matchPage: state.football.matchPage,
        locale: state.settings.locale,
    };
};

export default connect(mapStateToProps, { getMain, getMatch, getTournamentTable, getCupTree })(FootballMatch);
