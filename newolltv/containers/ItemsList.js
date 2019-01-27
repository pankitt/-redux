import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
import find from 'lodash/find';
import WithPoster from '../components/snippets/WithPoster';
import { Link } from 'react-router-dom';
// import { createLink } from '../helpers/createLink';
import LoadingGrid from '../components/LoadingGrid';
import Button from '../components/Button';
import { getVideoItems, updateVideoItems } from '../actions/videoItems';
import Dropdown from '../components/DropDown';
import getQueryParams from '../helpers/getQueryParams';
import { createName, parseQuery } from '../helpers/createName';
import t from '../i18n';
import Error from '../components/Error';
import { clearMeta, addMeta, clearCanonical, addCanonical } from '../helpers/metaTags';

class ItemsList extends Component {
    static propTypes = {
        id: PropTypes.string,
        type: PropTypes.string,
        config: PropTypes.object,
        menuProps: PropTypes.object,
        error: PropTypes.object,
        location: PropTypes.object,
        itemsList: PropTypes.object,
        videoItems: PropTypes.object,
        page: PropTypes.string,
        locale: PropTypes.string,
        getVideoItems: PropTypes.func,
        updateVideoItems: PropTypes.func,
        history: PropTypes.object.isRequired,
        collection: PropTypes.string,
        inBlocksList: PropTypes.bool,
    }

    setMeta() {
        let title, description;

        if (this.props.collection) {
            if (!this.props.itemsList) {
                return;
            }
            title = `${this.props.itemsList.title} — ${t('watch online on OLL.TV')}`;
            description = `${t('Collection')} ${this.props.itemsList.title} — ${t('watch online in high quality on OLL.TV')}`;
        } else {
            const translate_meta_key_suffix = this.props.id + (this.props.type ? '_' + this.props.type : '');
            title = t(`meta_title_items_list_${translate_meta_key_suffix}`);
            description = t(`meta_description_items_list_${translate_meta_key_suffix}`);
        }

        document.title = title;
        addMeta(
            {
                description,
            }
        );
    }

    createQuery = (entryObj) => {
        const { genre, order, page, collection } = entryObj;
        let obj = {};
        if (genre && genre !== '0') obj.genre = genre;
        if (order && order !== 'create-date') obj.order = order;
        if (page && page !== 0) obj.page = page;
        if (collection && collection !== '0') obj.collection = collection;
        return '?' + Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
    }

    handleShowMoreButtonClick = () => {
        const { genre, order } = getQueryParams();
        let page = 1;
        if (this.props.itemsList.page) {
            page = Number(this.props.itemsList.page) + 1;
        }
        this.props.history.replace(this.createQuery({ genre, order, page }));
    }

    handleOrderDropdownChange = (order) => {
        const { genre } = getQueryParams();
        this.props.history.replace(this.createQuery({ genre, order, page: 0 }));
    }

    handleGenreDropdownChange = (genre) => {
        const { order } = getQueryParams();
        this.props.history.replace(this.createQuery({ genre, order, page: 0 }));
    }

    getListData = () => {
        const { config, menuProps, type } = this.props;
        return Object.keys(menuProps).length ? menuProps : config.menu[type || 'olltv'];
    }

    getItems = () => {
        const { id, type, itemsList, getVideoItems, menuProps } = this.props;
        if (!itemsList) {
            if (menuProps.widgetType === 'collections') {
                getVideoItems('list', menuProps.tabs[0].preset.id);
            } else {
                const { genre, order, page } = getQueryParams();
                getVideoItems('category', id, type, genre, order, page, this.props.collection);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { id, type, location: { pathname, search }, updateVideoItems } = this.props;

        const { order, page, genre } = getQueryParams();

        if (prevProps.id !== id || prevProps.type !== type || prevProps.location.pathname !== pathname || prevProps.location.search !== search) {
            const prevQuery = parseQuery(prevProps.location.search),
                thisQuery = parseQuery(search);
            if (prevQuery && thisQuery) {
                if (thisQuery.page && (+thisQuery.page !== 0 && (!prevQuery.page && thisQuery.page) || prevQuery.page !== thisQuery.page)) {
                    return updateVideoItems('category', id, type, genre, order, page, this.props.collection);
                }
            }
            if (!this.props.inBlocksList) {
                this.setMeta();
            }
            return this.getItems();
        } else if (!this.props.inBlocksList && !prevProps.itemsList && this.props.itemsList) {
            this.setMeta();
        }
    }
    componentWillUnmount() {
        clearCanonical();
        if (!this.props.inBlocksList) {
            clearMeta();
        }
    }

    componentDidMount() {
        if (!this.props.inBlocksList) {
            this.setMeta();
        }
        this.getItems();
        addCanonical(this.props.locale + this.props.location.pathname);
        window.scrollTo(0, 0);
    }

    render() {
        if (this.props.error) return <Error {...this.props.error}/>;

        const { id: categoryId, type, videoItems: { items }, config, itemsList } = this.props;
        const itemsListConfigData = this.getListData();
        const activeTab = find(itemsListConfigData.tabs, tab => tab.preset.id === categoryId);
        const listCssClass = itemsListConfigData.widgetType || categoryId;
        const isCollection = this.props.collection !== undefined;

        const itemsGridClassName = listCssClass === 'amedia' ? 'grid cols-5@xxl cols-4@xl cols-4@l cols-3@ml cols-2@ms cols-2@s cols-2@xs items-list amedia' :
            ('grid cols-7@xxl cols-6@xl cols-5@l cols-4@ml cols-2@s cols-2@xs items-list ' + listCssClass);

        let heading;
        if (isCollection) {
            /**
             * TODO: fix styles
             */
            heading = <h2 className="heading rel">
                <Link className="" to={(itemsList && itemsList.collectionUrl) || ''} style={{
                    padding: '8px 14px 8px 14px',
                    display: 'inline-block',
                    verticalAlign: 'top',
                    borderRadius: '18px',
                    background: '#555',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    marginRight: '10px',
                    marginTop: '3px',
                    fontSize: '17px',
                }}>{t('All')}</Link>
                {(itemsList && itemsList.title) || ''}
            </h2>;
        } else {
            heading = <h2 className="heading rel">
                <span>{itemsListConfigData.title}</span>
                {'tabs' in itemsListConfigData && itemsListConfigData.tabs.length > 1 ?
                    <div className="tabs">
                        {map(itemsListConfigData.tabs, (tab, key) => {
                            const activeClassName = tab.preset.id === categoryId ? 'active' : '';
                            return <Link className={'tab ' + activeClassName} key={key} to={'/' + tab.preset.id + '/' + type}>{tab.title}</Link>;
                        })}
                    </div> :
                    null
                }
                <div className="dropdowns">
                    {activeTab && activeTab.genres && Object.keys(activeTab.genres).length > 1 ?
                        <Dropdown items={{ '0' : 'Все', ...activeTab.genres }} changeActive={this.handleGenreDropdownChange} customClassName="genres"  key={'genres_' + categoryId}/> : null}
                    {
                        itemsListConfigData.widgetType === 'collections' ? null :
                            <Dropdown items={config.order} changeActive={this.handleOrderDropdownChange} customClassName="order" key={'order_' + categoryId}/>
                    }
                </div>
            </h2>;
        }

        return (
            <div className="page-items-list">
                <div className="section container">
                    {heading}
                    {itemsList && itemsList.ids.length > 0 ?
                        <div className={itemsGridClassName}>
                            {map(itemsList.ids, (id, key) => {
                                const item = items[id];
                                return (
                                    <div className="col" key={key}>
                                        <WithPoster {...item} link={item.url}/>
                                    </div>
                                );
                            })}
                        </div> : <LoadingGrid grid={itemsGridClassName}/>}
                </div>
                <div className="container tac">
                    {itemsList && itemsList.hasMore ? <Button isDefault title={t('See more')} onClick={this.handleShowMoreButtonClick}/> : null}
                </div>
                {listCssClass === 'amedia' ? <div className="container amediaCopy">© 2017 Home Box Office, Inc. All rights reserved. HBO® and all related service marks are the property of Home Box Office, Inc.</div> : null}
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    const { id, type } = ownProps;
    const { order, page, genre } = getQueryParams();
    const { videoItems: { lists }, config, videoItems } = state;

    let menuProps, collection;

    if (ownProps.match && ownProps.match.params.url) {
        collection = ownProps.match.params.url.split('-')[0];
    }

    if (!collection && config && config.menu) {
        let path = ownProps.location.pathname.slice(1);
        if (path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        for (let rule in config.menu) {
            if (config.menu[rule].route === path) {
                menuProps = config.menu[rule];
                break;
            }
        }
    }

    if (!menuProps) {
        menuProps = config.menu[id] || {};
    }
    let name = (menuProps.widgetType === 'collections') ?
        'list=' + menuProps.tabs[0].preset.id :
        createName('category', id, type, genre, order, collection);

    return {
        itemsList:lists[name],
        locale: state.settings.locale,
        config,
        menuProps,
        page,
        videoItems,
        error: state.videoItems.error,
        collection,
    };
};

export default connect(mapStateToProps, { getVideoItems, updateVideoItems })(ItemsList);
