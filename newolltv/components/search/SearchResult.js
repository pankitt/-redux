import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSearchSuggest, getSearchByCategory } from '../../actions/search';
import map from 'lodash/map';
import WithPoster from '../snippets/WithPoster';
import Channel from '../snippets/Channel';
import ChannelProgram from '../snippets/ChannelProgram';
import Button from '../Button';
import Match from '../football/snippets/Match';
import { Link } from 'react-router-dom';
import t from '../../i18n';

class SearchResult extends Component {
    static propTypes = {
        getSearchSuggest: PropTypes.func,
        getSearchByCategory: PropTypes.func,
        search: PropTypes.object,
    }

    searchGroupsOrder = [
        {
            category: 'movies',
            title: t('Movies'),
        },
        {
            category: 'series',
            title: t('Series'),
        },
        {
            category: 'programs',
            title: t('Programs'),
        },
        {
            category: 'channels',
            title: t('Channels'),
        },
        {
            category: 'epg',
            title: t('Epg'),
        },
        {
            category: 'football',
            title: t('Football'),
        },
    ];

    chooseItem = (group, item) => {
        switch (group.category) {
            case 'movies':
            case 'series':
            case 'programs':
                return <WithPoster {...item} coverLarge={item.src} link={item.url}/>;
            case 'channels':
                return <Channel {...item} link={'/channels/' + item.id}/>;
            case 'epg':
                return <ChannelProgram {...item} link={'/channels/' + item.channelId + '/' + item.id}/>;
            case 'football':
                return <Link to={'/football/' + item.id} style={{ 'display':'block' }}>
                    <Match {...item} /></Link>;
            default:
                return null;
        }
    }

    createGrid = (group, key) => {
        switch (group.category) {
            case 'movies':
            case 'series':
            case 'programs':
                return 'grid cols-6@xxl cols-6@xl cols-5@l cols-4@ml cols-2@s cols-2@xs items-list ' + key;
            case 'channels':
                return 'grid cols-6@xxl cols-5@xl cols-4@l cols-3@ml cols-2@s cols-2@xs items-list ' + key;
            case 'epg':
                return 'grid cols-6@xxl cols-4@l cols-3@m cols-2@s cols-1@xs cols-4 items-list ' + key;
            case 'football':
                return 'grid cols-3@xxl cols-3@xl cols-2@l cols-1@ms cols-2 items-list ' + key;
            default:
                return 'grid cols-7@xxl cols-6@xl cols-5@l cols-4@ml cols-2@s cols-2@xs items-list ' + key;
        }
    }

    handleShowMoreClick = category => {
        const { search: { query, result } } = this.props;
        this.props.getSearchByCategory(query, category,  result[category].page ? result[category].page + 1 : 1);
    }

    render() {
        const { search } = this.props;
        if (!search.result) return null;
        const isLoadingClassName = search.isLoading ? 'loading' : '';

        const noResultTemplate = <div className="no-result">
            {t('According to your request')}
            <br/>
            {t('nothing found')}
        </div>;

        const resultTemplate = <div className={'search-result ' + isLoadingClassName} key={search.query}>
            {map(this.searchGroupsOrder, (resultGroup, key) => {
                const group = search.result[resultGroup.category];

                return (
                    group ? <div key={key} className="category">
                        <div className="title">{resultGroup.title}<span>{group.total}</span></div>
                        <div className={this.createGrid(resultGroup, key)}>
                            {map(group.items, (item, itemKey) => {
                                return <div className="col" key={itemKey}>
                                    {this.chooseItem(resultGroup, item)}
                                </div>;
                            })}
                        </div>
                        {group.hasMore ? <div className="tac">
                            <Button title={t('See more')} isDefault onClick={() => this.handleShowMoreClick(resultGroup.category)}/>
                        </div> : null}
                    </div> : null
                );
            })}
        </div>;

        const viewTemplate = !search.noResult ? resultTemplate : noResultTemplate;

        return (
            search.result ? viewTemplate : null
        );
    }
}
const mapStateToProps = state => {
    return {
        search: state.search,
    };
};

export default connect(mapStateToProps, { getSearchSuggest, getSearchByCategory })(SearchResult);
