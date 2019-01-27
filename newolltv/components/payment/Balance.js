import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import getQueryParams from '../../helpers/getQueryParams';
import { BALANCE_NULL, BALANCE_ENOUGH, BALANCE_NOT_ENOUGH } from '../../constants';
import t from '../../i18n';

export default class Balance extends Component {
    static propTypes = {
        user: PropTypes.object,
        subs: PropTypes.object,
        status: PropTypes.string,
    }

    render() {
        const { user, subs, status } = this.props;

        const { period } = getQueryParams();
        const currentSub = subs[period];
        if (!currentSub) return null;


        const balanceNum = Number(user.balance).toFixed(2),
            priceNum = Number(currentSub.priceWithDiscount).toFixed(2),
            needToPayNum = (priceNum - balanceNum).toFixed(2);

        return (
            <div className="payment-balance">

                {status === BALANCE_ENOUGH || status === BALANCE_NOT_ENOUGH ?
                    <Fragment>
                        <div className="payment-balance-has">
                            <div className="payment-balance-text">{t('On your balance')}</div>
                            <div>{balanceNum} грн</div>
                        </div>
                        <div className="payment-balance-need">
                            <div className="payment-balance-text">{t('Cost')}</div>
                            <div>{priceNum} грн</div>
                        </div>
                    </Fragment> : null}

                {status === BALANCE_NULL || status === BALANCE_NOT_ENOUGH ? <div className="payment-balance-need">
                    <div className="payment-balance-text">{t('To payment')}</div>
                    <div>{needToPayNum ? needToPayNum : ''} грн</div>
                </div> : null}

            </div>
        );
    }
}
