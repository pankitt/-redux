import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchInput from '../components/search/SearchInput';
import SearchResult from '../components/search/SearchResult';
import t from '../i18n';

export default class Search extends Component {
    static propTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }

    render() {
        return <div className="page-search">
            <div className="container">
                <h1>{t('Search')}</h1>
                <SearchInput history={this.props.history} location={this.props.location}/>
                <SearchResult />
            </div>
        </div>;
    }
}
