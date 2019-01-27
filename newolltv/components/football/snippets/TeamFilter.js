import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import filter from 'lodash/filter';
import capitalize from 'lodash/capitalize';
import t from '../../../i18n';

export default class TeamFilter extends Component {
    static propTypes = {
        clubs: PropTypes.object.isRequired,
        nationalTeams: PropTypes.object.isRequired,
        selectedId: PropTypes.number,
        query: PropTypes.string,
        onSelect: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            query: props.query,
            sortedClubs: map(props.clubs, club => club).sort((s1, s2) => {
                return s1.title.localeCompare(s2.title);
            }),
            sortedNationalTeams: map(props.nationalTeams, nationalTeam => nationalTeam).sort((s1, s2) => {
                return s1.title.localeCompare(s2.title);
            }),
        };
    }
    onType(query) {
        this.setState({ query });
    }
    componentDidMount() {
        this.input.focus();
        window.addEventListener('mousewheel', this.handleWindowWheel, false);
    }
    componentWillUnmount() {
        window.removeEventListener('mousewheel', this.handleWindowWheel);
    }
    handleWindowWheel = (event) => {
        let delta;
        if (event.wheelDelta) {
            delta = event.wheelDelta;
        } else {
            delta = -1 * event.deltaY;
        }
        if (!this.scrollContainer.contains(event.target) || delta < 0 && this.scrollContainer.scrollHeight - this.scrollContainer.scrollTop <= this.scrollContainer.offsetHeight) {
            event.preventDefault();
        }
    }
    render() {
        const { selectedId, onClose, onSelect } = this.props;
        const { query, sortedClubs, sortedNationalTeams } = this.state;

        const filteredClubs = query ? filter(sortedClubs, item => {
            return item.title.slice(0, query.length) === capitalize(query);
        }) : sortedClubs;

        const filteredNationalTeams = query ? filter(sortedNationalTeams, item => {
            return item.title.slice(0, query.length) === capitalize(query);
        }) : sortedNationalTeams;

        const clubItems = map(filteredClubs, club => {
            const { id, title } = club;
            const activeClassName = id === selectedId ? 'active' : null;
            return <li key={id} onClick={() => onSelect(id, this.state.query)} className={activeClassName}>{title}</li>;
        });

        const nationalTeamsItems = map(filteredNationalTeams, club => {
            const { id, title } = club;
            const activeClassName = id === selectedId ? 'active' : null;
            return <li key={id} onClick={() => onSelect(id, this.state.query)} className={activeClassName}>{title}</li>;
        });


        return (
            <div className="popup-wrapper">
                <div className="overlay" onClick={onClose}/>
                <div className="popup-body clubs">
                    <div className="popup-close-btn" onClick={onClose}/>
                    <div className="title">{t('Clubs and national teams')}</div>
                    <div className="name-filter">
                        <input type="text" value={this.state.query} key={2} placeholder={t('Start typing name')} onChange={e => this.onType(e.target.value) } ref={el => this.input = el}/>
                        {query ? <span className="name-filter-clear" onClick={() => this.onType('')}></span> : null}
                    </div>
                    <ul ref={el => this.scrollContainer = el} key={1}>
                        {!query ? <li key="a" className={!selectedId ? 'active' : ''} onClick={() => onSelect(null, '')}>{t('All')}</li> : null}
                        <li className="list-title">{t('Clubs')}</li>
                        {clubItems.length ? clubItems : <p className="text-grey">{t('Any command found')}</p>}
                        <li className="list-title">{t('National teams')}</li>
                        {nationalTeamsItems.length ? nationalTeamsItems : <p className="text-grey">{t('Any command found')}</p>}
                    </ul>
                </div>
            </div>
        );
    }
}
