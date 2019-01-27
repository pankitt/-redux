import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import t from '../../i18n';

const DATE_DELIMITER = ' / ';
const cardNumberFormat = '____ ____ ____ ____';

export default class Cart extends Component {
    static propTypes = {
        number: PropTypes.string,
        error: PropTypes.object,
        attachedCard: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        readOnly: PropTypes.bool,
    };

    state = {
        number: '',
        cardType: 'unknown',
        readOnly: false,
        dateRawValue: '',
        dateValue: '',
        month: '',
        year: '',
        cvv: '',
    };

    static getDerivedStateFromProps(props, state) {
        let nextState = null;
        if (props.number && !state.readOnly) {
            nextState = { readOnly: true, number: props.number };
        }

        if (props.error !== state.error) {
            nextState = nextState ? { ...nextState, error: props.error } : { error: props.error };
        }

        if (props.readOnly && state.cvv) {
            nextState = nextState ? { ...nextState, cvv: '' } : { cvv: '' };
        }

        return nextState;
    }

    onChangeNumber = number => {
        this.setState({ number, cardType: getCardType(number) });
    }

    onChangeDate = e => {
        let dateRawValue =  e.currentTarget.value ? e.currentTarget.value.replace(/\D+/g, '').substr(0, 4) : '';
        if (this.state.dateValue.length - e.currentTarget.value.length === 1 && !parseInt(this.state.dateValue[e.currentTarget.selectionStart], 10)) {
            dateRawValue = dateRawValue.slice(0, -1);
        }
        let dateValue = dateRawValue.match(/.{1,2}/g) || [];
        const [ month, year ] = dateValue;
        dateValue = dateValue.join(DATE_DELIMITER);
        if (dateValue.length === 2) {
            dateValue += DATE_DELIMITER;
        }
        this.setState({ dateRawValue, dateValue, month, year, dateError: dateRawValue.length === 4 && !this.isValidDate({ year, month }) });
    };

    onBlurDate = () => {
        if (this.state.dateRawValue && !this.isValidDate() && !this.state.dateError) {
            this.setState({ dateError: true });
        }
    }

    isValidDate(date) {
        const month = parseInt(date ? date.month : this.state.month, 10),
            year = date ? date.year : this.state.year,
            now = new Date(),
            nowYear = now.getFullYear().toString().substr(2, 2),
            nowMonth = now.getMonth();
        if (!month || !year || month > 12 || year < nowYear || year === nowYear && month < nowMonth) {
            return false;
        }
        return true;
    }

    onChangeCvv = e => {
        const cvv = e.currentTarget.value.replace(/\D+/g, '').substr(0, 3);
        this.setState({ cvv });
    };

    componentDidUpdate(prevProps, prevState) {
        const { number, month, year, cvv } = this.state;
        if (prevState.number !== number || prevState.month !== month || prevState.year !== year || prevState.cvv !== cvv) {
            this.props.onChange({
                number,
                month,
                year,
                cvv,
                isValid: isValidNumber(number) && !this.state.dateError && cvv.length === 3,
            });
        }
    }

    render() {
        const { readOnly, attachedCard } = this.props;
        const attachedCardMask = attachedCard ? attachedCard.mask : null,
            attachedCardValue = attachedCardMask ? attachedCardMask.slice(0, 2) + '**********' + attachedCardMask.slice(3, 7) : '';
        return (
            <div className="credit-card">
                <div className="credit-card-head">
                    <div className="logo-visa-mc"/>
                    <div className="logo-mcsc"/>
                </div>
                <div className="credit-card-body">
                    {attachedCard ? CardNumberAttached(attachedCardValue) : <Fragment>
                        <CardNumber onChange={this.onChangeNumber} readOnly={readOnly}/>
                        <div className={'credit-card-date input-block' + (this.state.dateError ? ' error' : '')}>
                            <div className="label">{t('Expiry')}</div>
                            <input
                                name="exp-date"
                                required
                                placeholder="__ / __"
                                autoComplete="cc-exp"
                                onChange={this.onChangeDate}
                                value={this.state.dateValue}
                                onBlur={this.onBlurDate}
                                readOnly={readOnly}
                            />
                        </div>
                        <div className="credit-card-cvv input-block">
                            <div className="label">СVV/CVC</div>
                            <input
                                type="password"
                                name="cvc"
                                required
                                placeholder="___"
                                onChange={this.onChangeCvv}
                                value={this.state.cvv}
                                readOnly={readOnly}
                            />
                        </div>
                    </Fragment>}
                </div>
            </div>
        );
    }
}

function CardNumberAttached(val) {
    return (
        <div className="credit-card-number input-block">
            <div className="label">{t('Card number')}</div>
            <input name="cardnumber" type="text" readOnly={true} value={val} key="cna" style={{ color: '#d2cece' }}/>
        </div>

    );
}

export class CardNumber extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
    };

    numberRef = createRef();

    state = {
        numberRawValue: '',
        numberPrettyValue: cardNumberFormat,
        numberError: false,
        numberCursorPosition: 0,
    };

    onChangeNumber = e => {
        let numberRawValue = e.currentTarget.value ? e.currentTarget.value.replace(/\D+/g, '').substr(0, 16) : '';
        let isDelete = false;
        if (this.state.numberPrettyValue.length - e.currentTarget.value.length === 1 && this.state.numberPrettyValue[e.currentTarget.selectionStart] === ' ') {
            numberRawValue = numberRawValue.slice(0, -1);
            isDelete = true;
        }
        if (numberRawValue === this.state.numberRawValue) {
            this.setState({ numberRawValue }); // for force update;
            return;
        }
        let numberPrettyValue = numberRawValue.match(/.{1,4}/g) || [];
        numberPrettyValue = numberPrettyValue.join(' ');
        numberPrettyValue += numberPrettyValue.length < cardNumberFormat.length ? cardNumberFormat.substr(numberPrettyValue.length) : '';
        let numberCursorPosition = numberPrettyValue.indexOf('_');
        if (numberCursorPosition === -1 || e.currentTarget.selectionStart < numberCursorPosition) {
            numberCursorPosition = e.currentTarget.selectionStart;
            if (!isDelete && numberCursorPosition && (numberPrettyValue[numberCursorPosition - 1] === ' ' || numberPrettyValue[numberCursorPosition] === ' ')) {
                numberCursorPosition++;
            }
        }
        this.setState({
            numberRawValue,
            numberPrettyValue,
            numberError: this.state.numberError && numberRawValue === this.state.numberRawValue,
            numberCursorPosition,
        });
    };

    onBlurNumber = () => {
        if (this.state.numberRawValue && !isValidNumber(this.state.numberRawValue) && !this.state.numberError) {
            this.setState({
                numberError: true,
            });
        }
    };

    componentDidMount() {
        if (this.numberRef.current) {
            this.numberRef.current.focus();
            this.numberRef.current.selectionStart = 0;
            this.numberRef.current.selectionEnd = 0;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const numberCursorPosition = this.state.numberCursorPosition;
        if (this.numberRef.current && numberCursorPosition !== -1 && this.numberRef.current.selectionStart !== numberCursorPosition) {
            this.numberRef.current.selectionStart = numberCursorPosition;
            this.numberRef.current.selectionEnd = numberCursorPosition;
        }
        if (prevState.numberRawValue !== this.state.numberRawValue) {
            this.props.onChange(this.state.numberRawValue);
        }
    }

    render() {
        return (
            <div className={'credit-card-number input-block' + (this.state.numberError ? ' error' : '')}>
                <div className="label">{t('Card number')}</div>
                <input
                    name="cardnumber"
                    required
                    autoComplete="cc-number"
                    type="text"
                    onBlur={this.onBlurNumber}
                    onChange={this.onChangeNumber}
                    value={this.state.numberPrettyValue}
                    ref={this.numberRef}
                    key="n"
                />
            </div>
        );
    }
}

function checksum(n) {
    let l = n.length, sum = 0, mx = 0, digit;
    while (l--) {
        digit = +n[l] << mx;
        sum += digit - (digit > 9) * 9;
        mx ^= 1;
    }
    return sum % 10 === 0 && sum > 0;
}

const isValidNumber = number => number && number.length === 16 && checksum(number);

function getCardType(number) {
    if (!number) {
        return 'unknown';
    }
    if (number[0] === '4') {
        return 'visa';
    }
    const firstTwo = +number.substr(0, 2);
    if (firstTwo && firstTwo > 54 && firstTwo < 56) {
        return 'mastercard';
    }
}
