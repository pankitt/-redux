import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getViewHistoryAmounts, getViewHistoryItems, clearViewHistoryItems } from '../../actions/viewHistory';
import t from '../../i18n';
import Button from '../../components/Button';
import map from 'lodash/map';
import WithPoster from '../../components/snippets/WithPoster';
import LoadingGrid from '../../components/LoadingGrid';
import { CONTENT_TYPE_HEADER_SERIES_ID, CONTENT_TYPE_HEADER_SHOW_ID } from '../../constants';
import { Link, Redirect } from 'react-router-dom';
import Highlight from '../../components/football/snippets/Highlight';
import Popup from '../Popup';

export const VH_TYPE_MOVIES = 'movies';
export const VH_TYPE_SERIES = 'series';
export const VH_TYPE_FOOTBALL = 'football';
export const VH_TYPES = [VH_TYPE_MOVIES, VH_TYPE_SERIES, VH_TYPE_FOOTBALL];
const ITEMS_PER_PAGE = 30;

class ViewHistory extends Component {
    static propTypes = {
        viewHistory: PropTypes.object,
        videoItems: PropTypes.object,
        football: PropTypes.object,
        getViewHistoryAmounts: PropTypes.func,
        getViewHistoryItems: PropTypes.func,
        clearViewHistoryItems: PropTypes.func,
        location: PropTypes.object,
        type: PropTypes.string,
        signed: PropTypes.bool,
    };

    state = {
        showClearHistoryPopup: false,
        idToDelete: null,
        clearHistoryPopupText: '',
    }

    getItems = (page = 1) => {
        const { viewHistory, getViewHistoryItems } = this.props;
        if (!(this.props.type in viewHistory.data) || page > viewHistory.data[this.props.type].page) {
            getViewHistoryItems(this.props.type, page);
        }
    }

    onShowMoreClick = () => {
        let newPage = this.props.viewHistory.data[this.props.type].page + 1;
        this.getItems(newPage);
    }

    getFirstTypeWithData = () => {
        if (!this.props.viewHistory.initialized) {
            return null;
        }
        for (let i = 0; i < VH_TYPES.length; i++) {
            if (this.props.viewHistory.amounts[VH_TYPES[i]].total > 0) {
                return VH_TYPES[i];
            }
        }
        return null;
    }

    closePopup = () => {
        this.setState({
            showClearHistoryPopup: false,
            idToDelete: null,
        });
    }

    onClearHistoryClick = () => {
        this.setState({
            showClearHistoryPopup: true,
            clearHistoryPopupText: t('history_cleaning_text'),
        });
    }

    clearHistory = () => {
        this.props.clearViewHistoryItems(this.state.idToDelete);
        this.closePopup();
    }

    onCloseBtnClick = (e, id, title) => {
        this.setState({
            showClearHistoryPopup: true,
            idToDelete: id,
            clearHistoryPopupText: t('history_cleaning_text_1') + title + t('history_cleaning_text_2'),
        });
    }

    componentDidMount() {
        if (!this.props.signed) {
            window.location.href = '/';
        }
        if (!this.props.viewHistory.initialized) {
            this.props.getViewHistoryAmounts();
        }
    }

    componentDidUpdate(prevProps) {
        const { type, viewHistory } = this.props;
        if (type !== undefined && (
            type !== prevProps.type || (
                viewHistory.initialized !== prevProps.viewHistory.initialized && this.getFirstTypeWithData()
            )
        )) {
            this.getItems();
        }
    }

    render() {
        const { viewHistory, videoItems, football, location, type } = this.props;
        const firstTypeWithData = this.getFirstTypeWithData();

        if (type === undefined && firstTypeWithData) {
            return <Redirect to={location.pathname + (location.pathname.endsWith('/') ? '' : '/') + firstTypeWithData}/>;
        }

        let typeSelector = !viewHistory.initialized ? null : (
            <div className="type-selector">
                {
                    Object.keys(viewHistory.amounts).map(type => (
                        viewHistory.amounts[type].total === 0 ? null :
                            <Link to={type} className={type === this.props.type ? 'active' : ''} key={type}>
                                {t('vh_' + type)}
                                <span>{viewHistory.amounts[type].total}</span>
                            </Link>
                    ))
                }
            </div>
        );

        const itemsGridClassName = type === VH_TYPE_FOOTBALL ?
            'grid cols-4@xxl cols-3@xl cols-3@l cols-2@m cols-1@s football-highlights-carousel' :
            'grid cols-7@xxl cols-6@xl cols-5@l cols-4@ml cols-2@s cols-2@xs items-list ';

        let sections = [];
        if (type in viewHistory.data) {
            const sectionNames = ['recent', 'old'];
            let ids = viewHistory.data[type].ids,
                amounts = viewHistory.amounts[type],
                headings = {
                    recent: (<span className="section-title">{t('recent')}<span>{amounts.recent}</span></span>),
                    old: (<span className="section-title">{t('more_than_a_month')}<span>{amounts.old}</span></span>),
                };

            for (let secInd = 0; secInd < 2; secInd++) {
                let section = sectionNames[secInd];

                if (amounts[section] === 0) {
                    continue;
                } else if (!ids[section].length) {
                    break;
                }

                sections.push(
                    <div className="section" key={section}>
                        <h2 className="heading">{headings[section]}</h2>
                        <div className={itemsGridClassName}>
                            {map(ids[section], id => {
                                let result;
                                if (type === VH_TYPE_FOOTBALL) {
                                    const highlight = football.highlights[id];
                                    const match = football.matches[highlight.matchId];
                                    result = (
                                        <Link className="highlight col" key={id} to={'/football/' + highlight.matchId + '/' + id}>
                                            <Highlight
                                                highlight={highlight}
                                                match={match}
                                                showViewPercentage={true}
                                                withMatchDesc/>
                                        </Link>
                                    );
                                } else {
                                    const item = videoItems.items[id];

                                    result = (
                                        <div className="col" key={id}>
                                            <WithPoster
                                                {...item}
                                                link={item.url}
                                                showAmediaCover={false}
                                                closeBtn={true}
                                                onCloseBtnClick={(e) => this.onCloseBtnClick(e, id, item.title)}
                                                showViewPercentage={[
                                                    CONTENT_TYPE_HEADER_SERIES_ID,
                                                    CONTENT_TYPE_HEADER_SHOW_ID,
                                                ].indexOf(item.typeId) === -1}/>
                                        </div>
                                    );
                                }
                                return result;
                            })}
                        </div>
                    </div>
                );
            }

            if ((viewHistory.data[type].page * ITEMS_PER_PAGE) < amounts.total && !viewHistory.isLoading) {
                sections.push(
                    <div className="tac see-more-container">
                        <Button title={t('See more')} isDefault onClick={this.onShowMoreClick} />
                    </div>
                );
            }
        } else {
            sections = !viewHistory.initialized || firstTypeWithData ?
                <div className="section" style={{ paddingTop: viewHistory.initialized ? '100px' : '156px' }}><LoadingGrid grid={itemsGridClassName}/></div> :
                <div className="tac">{t('here_will_be_history')}</div>;
        }

        return (
            <div className="page-view-history">
                <div className="container">
                    <h1>{t('View History')}</h1>
                    <div className="tac">
                        <Button title={t('Clear history')} isDefault isDisabled={!firstTypeWithData} onClick={this.onClearHistoryClick} />
                        {typeSelector}
                    </div>
                    {sections}
                </div>
                {!this.state.showClearHistoryPopup ? null :
                    <Popup
                        customClassName="w380"
                        onClose={this.closePopup}
                        title={t('History cleaning')}
                        text={this.state.clearHistoryPopupText}
                        cancelBtnTitle={t('Back')}
                        onCancel={this.closePopup}
                        submitBtnTitle={t('Clean')}
                        onSubmit={this.clearHistory} />
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        viewHistory: state.viewHistory,
        videoItems: state.videoItems,
        football: state.football,
        type: ownProps.match.params.type,
        signed: state.auth.signed,
    };
};

export default connect(mapStateToProps, { getViewHistoryAmounts, getViewHistoryItems, clearViewHistoryItems })(ViewHistory);