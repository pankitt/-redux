import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import orderBy from 'lodash/sortBy';
import t from '../../../i18n';
import Button from '../../Button';

class TournamentTable extends Component {
    static propTypes = {
        tournamentName: PropTypes.string,
        roundName: PropTypes.string,
        tournamentTable: PropTypes.object,
        homeTeamId: PropTypes.number,
        awayTeamId: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }

    handleCollapseButtonClick = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    render() {
        const { tournamentName, roundName, tournamentTable, homeTeamId, awayTeamId } = this.props;
        let sortedTournamentTable = orderBy(tournamentTable, [(a) => { return (+a.points) }], [(a) => { return (+a.goalsDiff) }]).reverse();
        const buttonTitle = this.state.collapsed ? 'Вся таблица' : 'Свернуть';
        const collapsedClassName = this.state.collapsed ? 'collapsed' : '';

        let group = null;
        for (let i = 0; i < sortedTournamentTable.length; i++) {
            if (sortedTournamentTable[i].id === homeTeamId || sortedTournamentTable[i].id === awayTeamId) {
                group = sortedTournamentTable[i].group;
                break;
            }
        }
        sortedTournamentTable = sortedTournamentTable.filter(el => el.group === group);

        return (
            <section className="tournamentTable">
                <h2>{tournamentName}</h2>
                <h3>{roundName}</h3>
                <table className={collapsedClassName}>
                    <thead>
                        <tr>
                            <th className="lrPad" />
                            <th className="position" />
                            <th className="commands">{t('Team')}</th>
                            <th><span>{t('Matches')}</span></th>
                            <th><span>{t('Winnings')}</span></th>
                            <th><span>{t('Draws')}</span></th>
                            <th><span>{t('Defeats')}</span></th>
                            <th><span>{t('Goals for')}</span></th>
                            <th><span>{t('Goals against')}</span></th>
                            <th><span>{t('Difference')}</span></th>
                            <th><span>{t('Points')}</span></th>
                            <th className="lrPad" />
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="first">
                            <td colSpan="12"/>
                        </tr>
                        {map(sortedTournamentTable, (item, i) => (
                            <tr className={(item.id === homeTeamId || item.id === awayTeamId) ? 'active' : ''}>
                                <td/>
                                <td className="position">{i + 1}</td>
                                <td className="commands"><span><img src={item.logo} title={item.title} /> <em className="title">{item.title}</em></span></td>
                                <td>{item.played}</td>
                                <td>{item.won}</td>
                                <td>{item.drawn}</td>
                                <td>{item.lost}</td>
                                <td>{item.goalsFor}</td>
                                <td>{item.goalsAgainst}</td>
                                <td>{item.goalsDiff}</td>
                                <td><b>{item.points}</b></td>
                                <td/>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="tac with-table-collapse-btn">
                    <Button title={buttonTitle} isSmall isDefault customClassName="table-collapse-btn" onClick={this.handleCollapseButtonClick}/>
                </div>
            </section>
        );
    }
}

export default TournamentTable;
