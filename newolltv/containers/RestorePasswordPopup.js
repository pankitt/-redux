import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { POPUP_TYPE_SIGN_IN } from '../constants';
import { passwordRestore } from '../actions/password';
import t from '../i18n';

export class RestorePasswordPopup extends Component {
    static propTypes = {
        onClose: PropTypes.func,
        error: PropTypes.object,
        onLinkClick: PropTypes.func,
        passwordRestore: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            login: '',
        };
    }

    handleSubmit = () => {
        this.props.passwordRestore(this.state.login);
    }

    handleKeyPress= (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleLoginChange = (e) => {
        this.setState({ login: e.target.value });
    }

    render() {
        console.log(this.props.error);
        return (
            <div className="sign-popup repair-password">
                <div className="close" onClick={this.props.onClose}/>
                <h3 className="title">{t('Password recovery')}</h3>
                <div className="subtext">{t('Enter email or mobile phone you entered on registration')}</div>
                <div className="input-block ">
                    <input type="text" onChange={this.handleLoginChange} value={this.state.login} onKeyPress={this.handleKeyPress}/>
                </div>
                <div className="error-block">
                    {this.props.error ? <div className="error">{this.props.error.message}</div> : null}
                </div>
                <div className="tac">
                    <Button title={t('Continue')} isPrimary isLarge isFluid onClick={this.handleSubmit} customClassName="gtm-reset-password-btn-click"/>
                </div>
                <div className="tac">
                    <Button title={t('Back')} isDefault isLarge customClassName="back-to-sign-btn" onClick={() => this.props.onLinkClick(POPUP_TYPE_SIGN_IN)}/>
                </div>
            </div>
        );
    }
}

export default connect(state => { return { error: state.sign.restoreError }}, { passwordRestore })(RestorePasswordPopup);
