import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SignInPopup from './SignInPopup';
import SignUpPopup from './SignUpPopup';
import SignUpConfirmPopup from './SignUpConfirmPopup';
import ChangePasswordPopup from './ChangePasswordPopup';
import RestorePasswordPopup from './RestorePasswordPopup';
import ConfirmPasswordPopup from './ConfirmPasswordPopup';
import EmailPasswordPopup from './EmailPasswordPopup';
import getQueryParams from '../helpers/getQueryParams';
import { showSignPopup, hideSignPopup } from '../actions/sign';
import { checkPasswordToken } from '../actions/password';
import { orderCallback } from '../actions/backcall';
import { CallBackPopup } from './CallBackPopup';
import { MessageSentPopup } from './MessageSentPopup';
import { login } from '../actions/auth';
import {
    POPUP_TYPE_SIGN_UP,
    POPUP_TYPE_SIGN_UP_CONFIRM,
    POPUP_TYPE_PASSWORD_CHANGE,
    POPUP_TYPE_PASSWORD_RESTORE,
    POPUP_TYPE_PASSWORD_CONFIRM,
    POPUP_TYPE_PASSWORD_EMAIL,
    POPUP_TYPE_CALL_BACK,
    POPUP_MESSAGE_SENT,
} from '../constants';

class Sign extends Component {
    static propTypes = {
        popupType: PropTypes.string,
        token: PropTypes.string,
        activationKey: PropTypes.string,
        checkPasswordToken: PropTypes.func,
        showSignPopup: PropTypes.func,
        hideSignPopup: PropTypes.func,
        orderCallback: PropTypes.func,
        login: PropTypes.func,
    }

    componentDidMount() {
        const { activationKey, token } = this.props;
        if (activationKey && activationKey !== token) {
            this.props.checkPasswordToken(activationKey);
        }
    }

    hidePopup = () => {
        this.props.hideSignPopup();
    }

    switchPopup = (type) => {
        this.props.showSignPopup(type);
    }

    handleLoginSubmit = (login, password) => {
        this.props.login(login, password);
    }

    render() {
        const { popupType } = this.props;
        if (!popupType) {
            return null;
        }

        let popup;
        switch (popupType) {
            case POPUP_TYPE_SIGN_UP:
                popup = <SignUpPopup onLinkClick={this.switchPopup} onClose={this.hidePopup}/>;
                break;
            case POPUP_TYPE_SIGN_UP_CONFIRM:
                popup = <SignUpConfirmPopup onLinkClick={this.switchPopup} onClose={this.hidePopup}/>;
                break;
            case POPUP_TYPE_PASSWORD_RESTORE:
                popup = <RestorePasswordPopup onLinkClick={this.switchPopup} onClose={this.hidePopup}/>;
                break;
            case POPUP_TYPE_PASSWORD_CONFIRM:
                popup = <ConfirmPasswordPopup onLinkClick={this.switchPopup} onClose={this.hidePopup}/>;
                break;
            case POPUP_TYPE_PASSWORD_EMAIL:
                popup = <EmailPasswordPopup onClose={this.hidePopup}/>;
                break;
            case POPUP_TYPE_PASSWORD_CHANGE:
                popup = <ChangePasswordPopup token={this.props.token} onClose={this.hidePopup}/>;
                break;
            case POPUP_TYPE_CALL_BACK:
                popup = <CallBackPopup orderCallback={this.props.orderCallback} onLinkClick={this.switchPopup} onClose={this.hidePopup}/>;
                break;
            case POPUP_MESSAGE_SENT:
                popup = <MessageSentPopup onClose={this.hidePopup}/>;
                break;
            default:
                popup = <SignInPopup onLinkClick={this.switchPopup} onClose={this.hidePopup} onSubmit={this.handleLoginSubmit}/>;
        }

        return (
            <div className="sign-wrapper">
                {popup}
                <div className="overlay" onClick={this.hidePopup}></div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const { activationKey } = getQueryParams();
    return {
        activationKey,
        token: state.sign.token,
        popupType: state.sign.popupType,
    };
};

export default connect(mapStateToProps, { showSignPopup, hideSignPopup, login, checkPasswordToken, orderCallback })(Sign);
