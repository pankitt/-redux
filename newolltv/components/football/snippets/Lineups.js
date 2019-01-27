import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../../../i18n';

class Lineups extends Component {
    static propTypes = {
        homeTeamLogo: PropTypes.string,
        homeTeam: PropTypes.string,
        homeTeamFormation: PropTypes.string,
        awayTeamLogo: PropTypes.string,
        awayTeam: PropTypes.string,
        awayTeamFormation: PropTypes.string,
        lineups: PropTypes.object,
        matchEvents: PropTypes.any.isRequired,
        substitutions: PropTypes.array,
        locale: PropTypes.string,
        homeTeamId: PropTypes.number,
    };

    state = {};

    static getDerivedStateFromProps(props, state) {
        if (state.lineups !== props.lineups || state.matchEvents !== props.matchEvents || state.substitutions !== props.substitutions) {
            const players = {}, onField = { homeTeam: [], awayTeam: [] }, substitutions = { homeTeam: [], awayTeam: [] };
            Object.keys(props.lineups)
                .forEach(team => props.lineups[team].forEach(member => {
                    players[member.player.id] = { ...member, goals: [], cards: [], substitution: null, hasRedCard: false };
                    if (member.position) {
                        onField[team].push(member.player.id);
                    } else {
                        substitutions[team].push(member.player.id);
                    }
                }));
            Object.keys(props.matchEvents)
                .forEach(eventType => props.matchEvents[eventType].forEach(event => {
                    players[event.playerId][eventType].push(event);
                    if (eventType === 'cards' && (event.subType === 'Red' || event.subType === 'YellowRed')) {
                        players[event.playerId].hasRedCard = true;
                    }
                }));
            props.substitutions.forEach(substitution => players[substitution.outPlayerId].substitution = substitution);

            return {
                lineups: props.lineups,
                matchEvents: props.matchEvents,
                substitutions: props.substitutions,
                players,
                homeTeamOnField: onField.homeTeam,
                awayTeamOnField: onField.awayTeam,
                homeTeamSubstitutions: substitutions.homeTeam,
                awayTeamOnSubstitutions: substitutions.awayTeam,
            };
        }
        return null;
    }

    render() {
        const players = this.state.players;
        const locale = this.props.locale === 'uk' ? 'ua' : this.props.locale;

        return (
            <section className="lineups">
                <div className="home-lineups">
                    <div className="lineups-logo">
                        <TeamLogo logo={this.props.homeTeamLogo} title={this.props.homeTeam} formation={this.props.homeTeamFormation}/>
                        <Substitution ids={this.state.homeTeamSubstitutions} players={players} locale={locale}/>
                    </div>
                    <PlayersOnField ids={this.state.homeTeamOnField} players={players} locale={locale} />
                </div>
                <div className="away-lineups">
                    <PlayersOnField ids={this.state.awayTeamOnField} players={players} locale={locale} />
                    <div className="lineups-logo">
                        <TeamLogo logo={this.props.awayTeamLogo} title={this.props.awayTeam} formation={this.props.awayTeamFormation}/>
                        <Substitution ids={this.state.awayTeamOnSubstitutions} players={players} locale={locale}/>
                    </div>
                </div>
            </section>
        );
    }
}

function TeamLogo(props) {
    return (
        <div>
            <img src={props.logo} className="logo"/>
            <h3>{props.title}</h3>
            <h5>{props.formation}</h5>
        </div>
    );
}

TeamLogo.propTypes = {
    logo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    formation: PropTypes.string.isRequired,
};

function Substitution({ ids, players, locale }) {
    return (
        <div className="lineups-substitute">
            <h6>{t('Substitutes')}</h6>
            <ul>
                {ids.map(id => <li key={id}><b>{players[id].number}</b> {players[id].player[locale + '_name']}</li>)}
            </ul>
        </div>
    );
}

Substitution.propTypes = {
    ids: PropTypes.array.isRequired,
    players: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};

function PlayersOnField({ ids, players, locale }) {
    return (
        <div className="lineups-list">
            <ul>
                {ids.map(id => {
                    const player = players[id];
                    return (
                        <PlayerOnField key={id} player={player} locale={locale}>
                            {player.substitution ?
                                <ul className="lineups-list-subs">
                                    <PlayerOnField player={players[player.substitution.inPlayerId]} locale={locale} substitution={player.substitution}/>
                                </ul> : null
                            }
                        </PlayerOnField>
                    );
                })}
            </ul>
        </div>
    );
}

PlayersOnField.propTypes = {
    ids: PropTypes.array.isRequired,
    players: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
};

const goalsTypeText = {
    owngoal: ' (АГ) ',
    penalty: ' (П) ',
};

function PlayerOnField({ player, locale, substitution, children }) {
    return (
        <li className={ (player.hasRedCard ? 'out ' : '') + (children ? 'was-subbed' : '')}>
            <em>{player.number}</em>
            {substitution ? <span className="sub-time">{substitution.minute + '\''}</span> : null}
            {player.player[locale + '_name']}
            {player.goals.length ? player.goals.map(goal => {
                const goalText = goalsTypeText[goal.subType];
                return <span key={goal.id} ><i className="goal" />{goalText ? <span>{goalText}</span> : null}</span>;
            }) : null}
            {player.cards.length ? player.cards.map(card => <i key={card.id} className={card.subType} />) : null}
            {children}
        </li>
    );
}

PlayerOnField.propTypes = {
    player: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    substitution: PropTypes.object,
    children: PropTypes.object,
};

export default Lineups;
