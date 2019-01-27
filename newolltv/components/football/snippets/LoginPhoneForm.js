import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../../i18n';

const phoneFormat = '+380 __ ___ __ __';

export default class LoginPhoneForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        phoneNumber: PropTypes.string,
        canSubmit: PropTypes.bool,
        error: PropTypes.object,
        maxAttemptAchieve: PropTypes.bool,
    }
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: props.phoneNumber,
            canSubmit: this.isValid(props.phoneNumber) && !props.error,
            cursorPosition: 0,
            error: props.error,
        };
    }
    onKeyDown(e) {
        let input = e.target;
        switch (e.keyCode) {
            case 8:
                if (input.selectionStart < 6) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                    // e.target.selectionStart = e.target.value.length;
                } else if (input.selectionStart === 8 || input.selectionStart === 12 || input.selectionStart === 15) {
                    input.selectionStart = input.selectionStart - 1;
                    input.selectionEnd = input.selectionEnd - 1;
                }
                return;
            case 13:
                if (this.state.canSubmit) {
                    return this.props.onSubmit(this.state.phoneNumber);
                }
                break;
            case 37:
            case 39:
                return;
            case 86:
                if (e.metaKey || e.ctrlKey) {
                    if (input.selectionStart < 6) {
                        input.selectionStart = 6;
                        input.selectionEnd = 6;
                    }
                    return;
                }
        }

        if (this.state.phoneNumber.length === 13 || /\D/.test(e.key)) {
            e.preventDefault();
            e.stopPropagation();
        } else if (input.selectionStart < 5) {
            input.selectionStart = input.value.length;
        }
    }
    onChange = (el) => {
        if (el.selectionStart < 4) {
            return;
        }
        this.updateValue();
    };

    updateValue() {
        let part = this.input.value.replace(/^\+380|\D/g, ''),
            phoneNumber = phoneFormat;
        for (let i = 0; i < part.length; i++) {
            phoneNumber = phoneNumber.replace(/_/, part[i]);
        }

        let cursorPosition = this.input.selectionStart;
        if (cursorPosition > phoneNumber.length || this.input.value.substr(0, this.input.selectionStart) !== phoneNumber.substr(0, this.input.selectionStart) || phoneNumber[cursorPosition] === ' ') {
            cursorPosition = phoneNumber.indexOf('_');
            if (cursorPosition === -1) {
                cursorPosition = phoneNumber.length;
            }
        }

        if (phoneNumber !== this.state.phoneNumber || cursorPosition !== this.state.cursorPosition) {
            this.setState({
                phoneNumber,
                canSubmit: this.isValid(phoneNumber) && this.props.canSubmit && !this.props.maxAttemptAchieve,
                cursorPosition,
                error: null,
            });
        }
    }
    isValid(phoneNumber) {
        return phoneNumber.replace(/\D/g, '').length === 12;
    }
    onFocus(e) {
        if (!this.state.phoneNumber) {
            this.setState({ phoneNumber: phoneFormat, cursorPosition: e.target.selectionStart });
        } else {
            this.updateValue();
        }
    }
    onBlur() {
        let phoneNumber = this.state.phoneNumber.replace(/_/g, '').trim();
        this.setState({ phoneNumber: phoneNumber.length === 4 ? '' : phoneNumber });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ error: nextProps.error });
    }
    componentDidUpdate() {
        if (this.input.selectionStart !== this.state.cursorPosition) {
            this.input.selectionStart = this.state.cursorPosition;
            this.input.selectionEnd = this.state.cursorPosition;
        }
    }
    componentDidMount() {
        this.input.focus();
        this.setState({ cursorPosition: 5 });
    }
    render() {
        return (
            <div className="phone-number">
                <div className="with-input">
                    <input
                        type="tel"
                        className={this.state.error ? 'error' : null }
                        placeholder={phoneFormat}
                        value={this.state.phoneNumber}
                        onKeyDown={e => this.onKeyDown(e)}
                        onChange={e => this.onChange(e.target)}
                        onFocus={e => this.onFocus(e)}
                        onBlur={() => this.onBlur()}
                        ref={el => this.input = el}
                        disabled={this.props.error && this.props.error.code === 423}
                        key="i"
                    />
                    <span className="border"/>
                    {this.state.error ? <div className="placeholder error">{this.state.error.message}</div> :
                        <div className="placeholder">{t('Enter your phone number and we send to you SMS with password')}</div>
                    }
                </div>
                <div className="tac">
                    <button className={'btn' + (this.state.canSubmit && !this.state.error ? '' : ' disabled')} onClick={() => this.props.onSubmit(this.state.phoneNumber)}>{t('Next')}</button>
                </div>
            </div>
        );
    }
}
