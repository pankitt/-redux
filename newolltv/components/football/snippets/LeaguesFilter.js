import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import t from '../../../i18n';
import sortBy from 'lodash/sortBy';

export default class LeaguesFilter extends Component {
    static propTypes = {
        leagues: PropTypes.object,
        selectedId: PropTypes.number,
        onClose: PropTypes.func,
        onSelect: PropTypes.func,

    }
    render() {
        const { leagues, selectedId, onSelect, onClose } = this.props;
        const sortedLeagues = sortBy(leagues, 'title');
        return (
            <div className="popup-wrapper">
                <div className="overlay" onClick={onClose}/>
                <div className="popup-body leagues">
                    <div className="popup-close-btn" onClick={onClose}/>
                    <div className="title">{t('Leagues')}</div>
                    <ul>
                        <li className={!selectedId ? 'active' : ''} onClick={() => onSelect(null)}>{t('All')}</li>
                        {map(sortedLeagues, league => <li key={league.id} onClick={() => onSelect(league.id)} className={league.id === selectedId ? 'active' : ''}>{league.title}</li>) }
                    </ul>
                </div>
            </div>
        );
    }
}
