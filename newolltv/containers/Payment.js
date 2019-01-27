import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPayment, balancePay, setValueForBanking, clearPaymentData } from '../actions/payment';
import map from 'lodash/map';
import filter from 'lodash/filter';
import t from '../i18n';
import { inflect } from '../helpers/string';
import { PERIOD_D1, PERIOD_D7, PERIOD_D14, PERIOD_D30, PERIOD_D90, PERIOD_D180, PERIOD_D365, BALANCE_NOT_ENOUGH, BALANCE_ENOUGH, BALANCE_NULL, POPUP_TYPE_SIGN_IN } from '../constants';
import PromoCode from '../components/payment/PromoCode';
import Balance from '../components/payment/Balance';
import PaymentSteps from '../components/payment/PaymentSteps';
import Button from '../components/Button';
import getQueryParams from '../helpers/getQueryParams';
import { showSignPopup } from '../actions/sign';

class Payment extends Component {
    static propTypes = {
        auth: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object,
        bundles: PropTypes.object,
        payment: PropTypes.object,
        match: PropTypes.object,
        submitPromo: PropTypes.func,
        getPayment: PropTypes.func,
        balancePay: PropTypes.func,
        setValueForBanking: PropTypes.func,
        showSignPopup: PropTypes.func,
        clearPaymentData: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { match: { params: { id } }, history, getPayment } = this.props;
        if (!id) {
            history.replace('/go');
        } else {
            getPayment(id);
        }
    }

    setPrice = (str) => {
        return str.split('.')[1] === '00' ? str.split('.')[0] : str;
    }

    getPeriodTitle = (period) => {
        switch (+period) {
            case PERIOD_D1:
                return t('Day');
            case PERIOD_D7:
                return t('7 days');
            case PERIOD_D14:
                return t('Two weeks');
            case PERIOD_D30:
                return t('Month');
            case PERIOD_D90:
                return t('3 Month');
            case PERIOD_D180:
                return t('6 Month');
            case PERIOD_D365:
                return t('12 Month');
            default:
                return period;
        }
    }

    getPrimarySub = () => {
        const { payment: { subs } }  = this.props;
        let sub = subs[PERIOD_D90];
        if (sub && sub.active) {
            return sub;
        }
        sub = subs[PERIOD_D30];
        if (sub && sub.active) {
            return sub;
        }
        const activePeriods = filter(subs, sub => sub.active);
        if (activePeriods && activePeriods[0]) {
            return activePeriods[0];
        }
    }

    componentDidUpdate(prevProps) {
        const { payment: { subs, data }, history: { replace }, getPayment, match:{ params: { id } } }  = this.props;
        if (subs && subs !== prevProps.payment.subs) {
            let period = getQueryParams().period;
            if (!period || !subs[period]) {
                this.selectPeriod(this.getPrimarySub());
            }
        }
        if ((!prevProps.payment.discount && this.props.payment.discount) || (prevProps.payment.discount && !this.props.payment.discount)) {
            getPayment(id);
        }

        if (!prevProps.payment.data && data) {
            replace('/payment/result');
        }
    }

    selectPeriod = (sub) => {
        if (sub && sub.active) {
            this.props.history.replace('?period=' + sub.id);
        }
    }

    backToBundles = () => {
        if (this.props.history.length > 2) {
            this.props.history.goBack();
        } else {
            this.props.history.replace('/go?bundles=' + this.props.match.params.id);
        }
    }

    componentWillUnmount() {
        this.props.clearPaymentData();
    }

    balanceStatus = () => {
        // Если баланс === 0 выводим "К оплате"
        // Если баланс > 0
        //     Если хватает на покупку выводим "Баланс", "Стоимость"
        //     Если не хватает выводим "Баланс", "Стоимость", "К оплате"

        if (this.paymentStats()) {
            const { balanceNum, needToPayNum } = this.paymentStats();

            if (balanceNum <= 0) {
                return BALANCE_NULL;
            }
            if (needToPayNum) {
                return BALANCE_NOT_ENOUGH;
            }
            return BALANCE_ENOUGH;
        }
    }

    paymentStats = () => {
        const { payment:{ user, subs } } = this.props;
        const { period } = getQueryParams();
        const currentSub = subs[period];

        if (!currentSub || !subs) return null;

        const balanceNum = Number(user.balance),
            priceNum = Number(currentSub.priceWithDiscount),
            needToPayNum = priceNum > balanceNum ? priceNum - balanceNum : null;

        return { balanceNum, priceNum, needToPayNum, currentSub };
    }

    paymentNextStep = () => {
        const { auth:{ signed }, showSignPopup, balancePay, setValueForBanking } = this.props;
        const { needToPayNum, currentSub } = this.paymentStats();

        if (!signed) {
            showSignPopup(POPUP_TYPE_SIGN_IN);
        } else if (this.balanceStatus() === BALANCE_ENOUGH) {
            balancePay({ subs: Object.keys(currentSub.tariffs) });
        } else if (this.balanceStatus() === BALANCE_NOT_ENOUGH || this.balanceStatus() === BALANCE_NULL) {
            setValueForBanking(needToPayNum);
            this.props.history.push('/payment/go/' + Object.keys(currentSub.tariffs).join(','));
        }
    }

    createTitle = () => {
        const { payment: { subsNames } } = this.props;
        let n = 0;
        const titles = map(subsNames, (name, key) => {
            const i = Object.keys(subsNames).indexOf(key);
            if (i < 3) {
                n++;
                return <span key={key}>&#171;{name}&#187;</span>;
            }
        });
        const other = Object.keys(subsNames).length - n;
        const otherStr = ' ' + t('and more') + ' ' + other + ' ' + inflect(other, t('inflect_pack'));
        return <div>{titles}{other ? otherStr : ''}</div>;
    }

    render() {
        const { payment: { subs, user }, bundles: { ids }, auth:{ signed } } = this.props;

        if (!subs) return null;

        const nextButtonTitle = this.balanceStatus() !== BALANCE_ENOUGH ? t('Pay') : t('Next');

        return (
            <div className="page-payment">

                {user && !!user.id ? <PaymentSteps activeStep={1} withSecondStep={this.paymentStats() && this.paymentStats().needToPayNum}/> : null}

                <div className="payment-title">
                    {this.createTitle()}
                </div>

                <div className="payment-blocks">
                    {map(subs, (sub, key) => {
                        const isDisabledClassName = !sub.active ? 'disabled' : '',
                            isSelectedClassName = +key === +getQueryParams().period ? 'selected' : '',
                            withPromoClassName = Number(sub.discount) > 0  ? 'with-promo' : '';

                        const currentPrice = Number(this.setPrice(sub.priceWithDiscount)),
                            prevPrice = sub.crossedOutPrice ? Number(this.setPrice(sub.crossedOutPrice)) : 1;

                        const economy = sub.crossedOutPrice ? ((prevPrice - currentPrice) / prevPrice * 100).toFixed(0) : null;

                        return <div key={key} className={'sub-period ' + isDisabledClassName + ' ' + isSelectedClassName + ' ' + withPromoClassName} onClick={() => this.selectPeriod(sub, key)}>
                            <div className="sub-period-title">{this.getPeriodTitle(key)}</div>
                            <div className="sub-period-price">
                                {sub.crossedOutPrice && sub.crossedOutPrice !== sub.priceWithDiscount ? <span className="crossed">{this.setPrice(sub.crossedOutPrice)} </span> : null}
                                {sub.priceWithDiscount ? <span className="price">{this.setPrice(sub.priceWithDiscount)}</span> : null}
                            </div>
                            <div className="sub-period-economy">
                                {!Number(sub.discount) && economy && Number(economy) > 0 ? <span className="">{t('cheaper on')} {economy}%</span> : null}
                                {Number(sub.discount) > 0 ? <span className="with-promo">{t('with promocode')}</span> : null}
                            </div>
                        </div>;
                    })}
                </div>

                {user && signed ? <div className="payment-promo tac">
                    <PromoCode subs={subs} id={this.props.match.params.id}/>
                    <Balance user={user} subs={subs} status={this.balanceStatus()}/>
                </div> : null}

                <div className="payment-actions">
                    <Button isDefault isLarge title={!!ids.length ? t('Back') : t('Cancel')} onClick={this.backToBundles}/>
                    <Button isPrimary isLarge title={nextButtonTitle} onClick={this.paymentNextStep}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        payment: state.payment,
        bundles: state.bundles,
    };
};

export default connect(mapStateToProps, { getPayment, showSignPopup, balancePay, setValueForBanking, clearPaymentData })(Payment);
