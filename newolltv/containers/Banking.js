import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserBankCards, pay, clearBanking } from '../actions/banking';
import { showSignPopup } from '../actions/sign';
import t from '../i18n';
import PaymentSteps from '../components/payment/PaymentSteps';
import CreditCard from '../components/payment/CreditCard';
import Button from '../components/Button';

// const MAX_AMOUNT = 2500;

class Banking extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        userBankCards: PropTypes.array.isRequired,
        userBankCardsRequest: PropTypes.bool.isRequired,
        userBankCardsError: PropTypes.object,
        attachedCard: PropTypes.object,
        paymentRequest: PropTypes.bool.isRequired,
        paymentStatus: PropTypes.object.isRequired,
        transactionInProgress: PropTypes.bool.isRequired,
        pay: PropTypes.func.isRequired,
        clearBanking: PropTypes.func.isRequired,
        valueForBanking: PropTypes.number.isRequired,
        showSignPopup: PropTypes.func.isRequired,
        signed: PropTypes.bool.isRequired,
        bundles: PropTypes.object,
    };

    state = {
        propsError: false,
        checked: false,
        transactionInProgress: false,
        card: null,
    };

    amountRef = createRef();

    static getDerivedStateFromProps(props, state) {
        let amount = props.valueForBanking;
        let tariffs = [];
        const transactionInProgress = props.transactionInProgress;

        if (typeof props.match.params.tariffs === 'string') {
            props.match.params.tariffs.split(',').forEach(id => {
                const tariffId = parseInt(id, 10);
                if (tariffId) {
                    tariffs.push(tariffId);
                }
            });
        }

        if (!amount || amount <= 0 || !tariffs.length || tariffs.join(',') !== props.match.params.tariffs) {
            return { propsError: true };
        }

        if (typeof state.amount === 'undefined') {
            // amount = amount.toString();
            return {
                amount,
                tariffs,
                transactionInProgress,
                amountInputCursorPosition: amount.length,
            };
        }

        if (transactionInProgress !== state.transactionInProgress) {
            return { transactionInProgress };
        }


        return null;
    }

    switchChecked = () => {
        this.setState({ checked: !this.state.checked });
    }

    onChangeAmount = e => {
        let amount = e.currentTarget.value.replace(/\D+/g, '').substr(0, 5);
        // if (amount <= MAX_AMOUNT) {
        if (amount === this.state.amount && (amount + ' грн').length > e.currentTarget.value.length) {
            amount = amount.slice(0, -1);
        } else if (this.state.amount === '0') {
            amount = amount[0] === '0' ? amount.slice(1) : amount.slice(0, -1);
        }
        let amountInputCursorPosition = e.currentTarget.selectionStart;
        if (!amount) {
            amount = '0';
            amountInputCursorPosition = 1;
        } else if (amountInputCursorPosition > amount.length) {
            amountInputCursorPosition = amount.length;
        }
        this.setState({ amount, amountInputCursorPosition });
        // }
    }

    onChangeCardData = card => {
        if (card.isValid) {
            const { number, month, year, cvv } = card;
            const stateCard = this.state.card;
            if (!stateCard || stateCard.number !== number || stateCard.month !== month || stateCard.year !== year || stateCard.cvv !== cvv) {
                this.setState({ card: { number, month, year, cvv } });
            }
        } else if (this.state.card) {
            this.setState({ card: null });
        }
    }

    canSubmit() {
        return (this.state.card || this.props.attachedCard)  && this.state.checked && this.state.amount && !this.state.transactionInProgress;
    }

    submit = () => {
        this.setState({ transactionInProgress: true });
        this.props.pay((this.state.card || this.props.attachedCard.hash), this.state.amount, this.state.tariffs, true);
    }

    componentDidMount() {
        if (!this.props.signed) {
            this.props.showSignPopup();
        }
        if (!this.props.valueForBanking) {
            this.props.history.replace('/go');
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.paymentStatus.error && this.props.paymentStatus.error && this.props.paymentStatus.error.code === 401) {
            this.props.showSignPopup();
            return;
        }

        if (prevProps.transactionInProgress && !this.props.transactionInProgress && this.props.paymentStatus.status === 'ok') {
            this.props.history.replace('/payment/result');
        }

        const amountInput = this.amountRef.current;

        if (amountInput && amountInput.selectionStart !== this.state.amountInputCursorPosition) {
            amountInput.selectionStart = this.state.amountInputCursorPosition;
            amountInput.selectionEnd = this.state.amountInputCursorPosition;
        }

        if (prevProps.valueForBanking && !this.props.valueForBanking) {
            this.props.history.replace('/go');
        }
    }

    componentWillUnmount() {
        this.props.clearBanking();
    }

    handleBack = () => {
        // const { valueForBanking } = this.props;
        // if (valueForBanking) {
        //     this.props.history.goBack();
        // } else {
        //     this.props.history.replace('/go');
        // }
        this.props.history.goBack();
    }

    render() {
        if (this.state.propsError || !this.props.signed || (this.props.paymentStatus.error && this.props.paymentStatus.error.code === 401))  {
            return <div>Error</div>;
        }

        return (
            <div className="banking-page">

                <PaymentSteps activeStep={2} withSecondStep/>

                <form>
                    <div className="banking-page-amount input-block">
                        <span className="banking-page-amount-label">{t('To pay:')} <span className="banking-page-amount-value">{this.state.amount.toFixed(2) + ' грн'}</span>
                        </span>
                        {/* <input
                            className="banking-page-input banking-page-amount-input"
                            value={this.state.amount + ' грн'}
                            onChange={this.onChangeAmount}
                            readOnly={this.state.transactionInProgress}
                            ref={this.amountRef}
                            key="a"
                        /> */}

                        {/* <span className="banking-page-amount-annotation">{t('Maximum sum')} —<br />{MAX_AMOUNT}грн</span> */}
                    </div>
                    <CreditCard onChange={this.onChangeCardData} readOnly={this.state.transactionInProgress || this.props.attachedCard} attachedCard={this.props.attachedCard}/>
                    <div className="banking-page-checkbox" onClick={this.switchChecked}>
                        <div className={'checkbox' + (this.state.checked ? ' active' : '')}/>
                        <div className="checkbox-label">{t('I confirm with ')}<a className="banking-page-offer-link" href="/terms" target="_blank" onClick={e => e.stopPropagation()}>{t('user agreements')}</a></div>
                    </div>
                    {this.props.paymentStatus.error ? <div className="banking-page-error">{this.props.paymentStatus.error.message}</div> : null}
                    <div className="banking-page-actions">
                        <Button title={t('Back')} customClassName={'banking-page-buttons'} isDefault isLarge onClick={this.handleBack}/>
                        <Button title={t('Pay')} customClassName={'banking-page-buttons'} isPrimary isDisabled={!this.canSubmit()} isLarge onClick={this.submit}/>
                    </div>
                    <div className="banking-page-auto-prolongation-message">{t('auto_prolongation_message')}</div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.banking,
        signed: state.auth.signed,
        bundles: state.bundles,
        attachedCard: state.payment.user && state.payment.user.cards && state.payment.user.cards.length ? state.payment.user.cards[0] : null,
    };
};

export default connect(mapStateToProps, { getUserBankCards, pay, clearBanking, showSignPopup })(Banking);
