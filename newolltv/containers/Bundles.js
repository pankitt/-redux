import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import Cart from '../components/bundles/Cart';
import Bundle from '../components/bundles/Bundle';
import BundleModal from '../components/bundles/BundleModal';
import getBundles from '../actions/bundles';
import { getAllChannels } from '../actions/channels';
import t from '../i18n';
class Bundles extends Component {
    static propTypes = {
        auth: PropTypes.object,
        history: PropTypes.object,
        match: PropTypes.object,
        bundles: PropTypes.object,
        detailsId: PropTypes.number,
        channels: PropTypes.object,
        selectedBundlesArray: PropTypes.array,
        location: PropTypes.object,
        getBundles: PropTypes.func,
        getNewBundles: PropTypes.func,
        getOldBundles: PropTypes.func,
        getAllChannels: PropTypes.func,
    }

    validateQuery = () => {
        const { selectedBundlesArray, detailsId } = this.props;
        let filteredBundlesArray = filter(selectedBundlesArray, bundle => {
            if (bundle !== '' && bundle !== '.' &&  bundle.match('^[0-9]*$')) return bundle;
        });
        this.updateQuery(detailsId, filteredBundlesArray);
    }

    updateQuery = (detailsId, filteredBundlesArray) => {
        let detailsIdString = detailsId && !isNaN(detailsId) ? 'id=' + detailsId : null;
        let bundlesString = !!filteredBundlesArray.length ? 'bundles=' + filteredBundlesArray : null;

        if (!detailsIdString && !bundlesString) {
            this.props.history.replace(this.props.location.pathname);
        } else if (!detailsIdString && bundlesString) {
            this.props.history.replace('?' + bundlesString);
        } else if (detailsIdString && !bundlesString) {
            this.props.history.replace('?' + detailsIdString);
        } else {
            this.props.history.replace('?' + detailsIdString + '&' + bundlesString);
        }
    }

    getBundleGroup = (id) => {
        const {  bundles } = this.props;
        let group = [];
        if (bundles.items[id] && bundles.items[id].groupId) {
            forEach(bundles.items, item => {
                if (item.groupId === bundles.items[id].groupId) {
                    group.push(item.subsId + '');
                }
            });
        }
        return group;
    }

    updateBundles = (id, action) => {
        const { selectedBundlesArray, detailsId } = this.props;
        let bundlesQuery = selectedBundlesArray;
        if (action === 'add') {
            if (selectedBundlesArray.indexOf(id + '') === -1) {
                const group = this.getBundleGroup(id);
                if (!!group.length) {
                    bundlesQuery = filter(selectedBundlesArray, _id => !group.includes(_id));
                }
                bundlesQuery += ',' +  id;
            }
        } else if (action === 'remove') {
            if (selectedBundlesArray.indexOf(id + '') !== -1) {
                const index = selectedBundlesArray.indexOf(id + '');
                selectedBundlesArray.splice(index, 1);
            }
        }
        this.updateQuery(detailsId, bundlesQuery);
    }

    updateDetailsId = (id, action) => {
        const { selectedBundlesArray } = this.props;
        if (action === 'remove') {
            document.body.classList.remove('ovh');
            this.updateQuery(null, selectedBundlesArray);
        } else {
            document.body.classList.add('ovh');
            this.updateQuery(id, selectedBundlesArray);
        }
    }

    componentDidMount() {
        const { match:{ params: { type } }, getBundles, bundles } = this.props;

        if (!bundles.ids.length) {
            getBundles(type);
        }
        if (!this.props.channels.ids.length) {
            this.props.getAllChannels();
        }
        this.validateQuery();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.search !== this.props.location.search) {
            this.validateQuery();
        }
        if ((prevProps.bundles.ids !== this.props.bundles.ids) && !this.props.match.params.type) {
            this.props.history.replace(this.props.location.pathname + '/' + this.props.bundles.page);
        }
        if (prevProps.match.params.type !== this.props.match.params.type) {
            this.props.getBundles(this.props.match.params.type);
        }
    }

    render() {
        const { selectedBundlesArray, bundles, channels, detailsId, auth } = this.props;

        return (
            <div className="page-bundles">
                <Cart bundles={bundles.items} selected={selectedBundlesArray} selectBundle={this.updateBundles} history={this.props.history} auth={auth}/>
                <div className="bundles-tabs">
                    <Link to="/go/new" className={this.props.bundles.page === 'new' ? 'active' : ''}>{t('All TV at once')}</Link>
                    <Link to="/go/old" className={this.props.bundles.page === 'old' ? 'active' : ''}>{t('TV choice')}</Link>
                </div>
                <div className="container">
                    <div className="bundles-list">
                        {map(bundles.ids, id => <Bundle
                            channels={channels.items}
                            item={bundles.items[id]}
                            key={id}
                            onSelect={this.updateBundles }
                            isActive={selectedBundlesArray.indexOf(id + '') !== -1}
                            onClick={this.updateDetailsId}
                            specialOffers={bundles.specialOffers}
                        />)}
                    </div>
                </div>
                {detailsId ? <div className="bundle-modal">
                    <div className="overlay" onClick={() => this.updateDetailsId(detailsId, 'remove')}></div>
                    {bundles && bundles.items[detailsId] ? <BundleModal
                        specialOffers={bundles.specialOffers}
                        channels={channels.items}
                        item={bundles.items[detailsId]}
                        onSelect={this.updateBundles}
                        onClick={this.updateDetailsId}
                        isActive={selectedBundlesArray.indexOf(detailsId + '') !== -1}
                    /> : null}
                </div> : null}
                {bundles.specialOffers ? <div className="special-offers-docs container">
                    {map(bundles.specialOffers, (star, id) => <div key={id}>{star} {t('There are special conditions')}. <a href={'http://i.ollcdn.net/current/documents/' + id + '.pdf'} rel="noopener noreferrer"  target="_blank" className="link"> {t('More details')}</a>.</div>)}
                </div> : null}

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { location: { search } } = ownProps;
    let selectedBundlesArray = [], detailsId = null;
    let result = {};
    forEach(search.slice(1).split('&'), item => {
        result[item.split('=')[0]] = item.split('=')[1];
    });

    if (result.bundles) {
        selectedBundlesArray =  result.bundles.split(',');
    }
    if (result.id) {
        detailsId = +result.id;
    }
    return {
        selectedBundlesArray,
        detailsId,
        auth: state.auth,
        bundles: state.bundles,
        channels: state.channels,
    };
};

export default connect(mapStateToProps, { getBundles, getAllChannels })(Bundles);
