import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../components/Button';
import PaymentSteps from '../components/payment/PaymentSteps';
import map from 'lodash/map';
import { PERIOD_D1, PERIOD_D7, PERIOD_D14, PERIOD_D30, PERIOD_D90, PERIOD_D180, PERIOD_D365 } from '../constants';
import t from '../i18n';
import getBundles from '../actions/bundles';

class PaymentResult extends Component {
    static propTypes = {
        match: PropTypes.object,
        bundles: PropTypes.object,
        history: PropTypes.object,
        payment: PropTypes.object,
        getBundles: PropTypes.func,
    }

    getPeriodTitle = (period) => {
        switch (+period) {
            case PERIOD_D1:
                return t('Day');
            case PERIOD_D7:
                return t('onWeek');
            case PERIOD_D14:
                return t('Two weeks');
            case PERIOD_D30:
                return t('Month');
            case PERIOD_D90:
                return t('3 Month');
            case PERIOD_D180:
                return t('Half year');
            case PERIOD_D365:
                return t('Year');
            default:
                return period;
        }
    }

    componentDidMount() {
        const { match:{ params: { type } }, getBundles, bundles } = this.props;
        if (bundles.ids.length) {
            getBundles(type);
        }
        if (!this.props.payment.data) {
            this.props.history.replace('/');
        }
    }
    handleClick= () => {
        const { payment: { data: { url } }, history: { replace } } = this.props;
        if (url) {
            replace(url);
        } else {
            replace('/');
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.type !== this.props.match.params.type) {
            this.props.getBundles(this.props.match.params.type);
        }
    }

    render() {
        if (!this.props.payment.data) return null;
        const { payment: { data } } = this.props;

        const tariffsArray = map(data.tariffs, sub => sub.name);

        return (
            <div>
                <PaymentSteps activeStep={3} withSecondStep/>
                <div className="payment-result">
                    <h1>{t('Congratulations')}!</h1>

                    {!!tariffsArray.length ? <h2>{t('You bought')} {map(tariffsArray, (item, key) => {
                        let divider = '';
                        if (key + 1 < tariffsArray.length) {
                            divider = ', ';
                            if (key + 1 === tariffsArray.length - 1) {
                                divider = ' ' + t('and') + ' ';
                            }
                        }
                        return (
                            <span key={key}>&#171;{item}&#187;{divider}</span>
                        );
                    })} {t('on')} {this.getPeriodTitle(data.tariffs[0].duration)}</h2> :
                        <h2>{t('Payment was successful')}</h2>}

                    <div className="tac">
                        <Button title="Готово" isLarge isPrimary onClick={this.handleClick}/>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        bundles: state.bundles,
        payment: state.payment,
        auth: state.auth,
    };
};

export default connect(mapStateToProps, { getBundles })(PaymentResult);
