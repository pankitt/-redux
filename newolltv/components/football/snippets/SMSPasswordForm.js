import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../../i18n';

export default class SMSPasswordForm extends Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        resendSMSPassword: PropTypes.func.isRequired,
        phoneNumber: PropTypes.string,
        error: PropTypes.string,
        clearAuth: PropTypes.func,
        loading: PropTypes.bool,
    }
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            canSubmit: false,
            canResend: false,
            error: '',
        };
        this.allowResendTimeout = setTimeout(() => this.setState({ canResend: true }), 30000);
        this.passwordExpiredTimeout = setTimeout(this.props.clearAuth, 300000);
    }
    onKeyDown(e) {
        switch (e.keyCode) {
            case 13:
                if (this.state.canSubmit) {
                    return this.props.onSubmit(this.state.password);
                }
                break;
            case 8:
            case 37:
            case 39:
                return;
        }

        if (this.state.password.length === 4 || /\D/.test(e.key)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    onChange(el) {
        const value = el.value.replace(/\D/g, '').substr(0, 4);
        if (value.length <= 4) {
            this.setState({ password: value, canSubmit: value.length === 4, error: '' });
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ error: nextProps.error });
    }
    componentWillUnmount() {
        if (this.allowResendTimeout) {
            clearTimeout(this.allowResendTimeout);
        }
        clearTimeout(this.passwordExpiredTimeout);
    }
    componentDidMount() {
        this.input.focus();
    }
    render() {
        const { phoneNumber, onSubmit } = this.props;
        return (
            <div className="password-block">
                <h5 className="tac">{t('By number') + ' ' + phoneNumber}</h5>
                <div className="notify">
                    {t('SMS Password was sent to your phone') + ' ' + phoneNumber}<br/>
                    {t('Password valid for 5 minutes')}
                </div>
                <div className="with-input">
                    <input
                        type="tel"
                        className={this.state.error ? 'error' : null}
                        onChange={e => this.onChange(e.target)}
                        onKeyDown={e => this.onKeyDown(e)}
                        value={this.state.password}
                        ref={el => this.input = el}
                        disabled={this.props.loading}
                        key="i"
                    />
                    <span className="border"/>
                    {this.state.error ? <div className="placeholder">{this.state.error.message}</div> : null}
                    <div className="placeholder">{t('Enter password from SMS')}</div>
                </div>
                <div className="tac">
                    <button className={'btn' + (this.state.canSubmit || this.props.loading ? '' : ' disabled') } onClick={() => onSubmit(this.state.password)}>{t('Sign in')}</button>
                </div>
                {this.state.canResend && !this.props.loading ?
                    <div className="send-again" onClick={this.props.resendSMSPassword}>
                        <span>{t('Resend password')}</span>
                    </div> :
                    null
                }
            </div>
        );
    }
}
