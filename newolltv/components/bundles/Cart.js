import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import Button from '../Button';
import t from '../../i18n';

export default class Cart extends Component {
    static propTypes = {
        selected: PropTypes.array,
        bundles: PropTypes.object,
        history: PropTypes.object,
        selectBundle: PropTypes.func,
        auth: PropTypes.object.isRequired,
    }

    selectBundle = (id, action = 'add') => {
        this.props.selectBundle(id, action);
    }

    createCommonPrice = () => {
        const { bundles, selected } = this.props;
        let result = 0;
        forEach(selected, id => {
            if (bundles[id]) {
                result += Number(bundles[id].price);
            }
        });
        return result;
    }

    goToPayment = () => {
        const { selected } = this.props;
        this.props.history.push('/payment/' + selected.join());
    }

    render() {
        const { bundles, selected, auth } = this.props;
        const commonPrice = this.createCommonPrice();
        const signedClass = auth.signed ? 'gtm-click-buy' : 'gtm-click-registrate';

        if (!Object.keys(bundles).length) return null;

        const promoBundles = filter(bundles, bundle => bundle.promote);

        let cartString = t('Select one or more packages'), promoBundlesTemplate = null;

        if (!!promoBundles.length) {
            cartString += ', ' + t('for example') + ', ';
            promoBundlesTemplate = map(promoBundles, (bundle, key) => {
                const divider = key === (promoBundles.length - 2) ? (' ' + t('or') + ' ') : ' ';
                return <Fragment>
                    <span className="clickable" key={key} onClick={() => this.selectBundle(bundle.subsId)}>{bundle.name}</span>
                    {divider}
                </Fragment>;
            });
        }

        const defaultTemplate = <span className="tip">{cartString}{promoBundlesTemplate}</span>;

        const selectedTemplate = <div className="payment-block">
            {map(selected, id => {
                const bundle = bundles[id];
                return bundle ? <Button customClassName="with-close-icon" key={id} isSmall isDefault onClick={() => this.selectBundle(id, 'remove')} title={bundle.name}/> : null;
            })}
            <Button title={t('Buy') + ' за ' + commonPrice + ' грн'} isPrimary onClick={this.goToPayment} customClassName={signedClass}/>
        </div>;

        return (
            <div className="cart">
                {!selected.length ? defaultTemplate : selectedTemplate}
            </div>
        );
    }
}
