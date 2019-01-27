import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { POPUP_TYPE_SIGN_UP } from '../constants';
import { signupConfirm } from '../actions/sign';
import t from '../i18n';

export class SignUpConfirmPopup extends Component {
    static propTypes = {
        onClose: PropTypes.func,
        onLinkClick: PropTypes.func,
        signupConfirm: PropTypes.func,
        phone: PropTypes.string,
        signUpConfirmError: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            password: '',
        };
    }

    handleKeyPress= (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.signupConfirm(this.props.phone, this.state.password);
    }

    handlePasswordChange = e => {
        this.setState({ password: e.target.value });
    }

    render() {
        const { signUpConfirmError } = this.props;
        return (
            <div className="sign-popup repair-password">
                <div className="close" onClick={this.props.onClose}/>
                <h3 className="title">{t('Confirm registration')}</h3>
                <div className="input-block ">
                    <div className="label">{t('Enter password from SMS')}</div>
                    <input type="password" onChange={this.handlePasswordChange} value={this.state.password} onKeyPress={this.handleKeyPress}/>
                </div>
                <div className="error-block">
                    {signUpConfirmError ? <div className="error">{signUpConfirmError.message}</div> : null}
                </div>
                <div className="tac">
                    <Button title={t('Continue')} isPrimary isLarge isFluid onClick={this.handleSubmit} customClassName="gtm-confirm-password-btn-click"/>
                </div>
                <div className="tac">
                    <Button title={t('Back')} isDefault isLarge customClassName="back-to-sign-btn" onClick={() => this.props.onLinkClick(POPUP_TYPE_SIGN_UP)}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        signUpConfirmError: state.auth.signUpConfirmError,
        phone: state.sign.login,

    };
};

export default connect(mapStateToProps, { signupConfirm })(SignUpConfirmPopup);
