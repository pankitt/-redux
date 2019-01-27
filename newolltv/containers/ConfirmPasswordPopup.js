import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { showSignPopup } from '../actions/sign';
import { passwordConfirm } from '../actions/password';
import { POPUP_TYPE_PASSWORD_RESTORE } from '../constants';
import t from '../i18n';

export class ConfirmPasswordPopup extends Component {
    static propTypes = {
        onClose: PropTypes.func,
        showSignPopup: PropTypes.func,
        passwordConfirm: PropTypes.func,
        login: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            password: '',
        };
    }

    handleSubmit = () => {
        this.props.passwordConfirm(this.props.login, this.state.password);
    }

    handleKeyPress= (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }


    handlePasswordChange = e => {
        this.setState({ password: e.target.value });
    }

    render() {
        return (
            <div className="sign-popup repair-password">
                <div className="close" onClick={this.props.onClose}/>
                <h3 className="title">{t('Password recovery')}</h3>
                <div className="input-block ">
                    <input type="text" value={this.props.login} disabled="disabled" />
                </div>
                <div className="restore-num">
                    <div className="repair" onClick={() => this.props.showSignPopup(POPUP_TYPE_PASSWORD_RESTORE)}>{t('Enter another phone number')}</div>
                </div>
                <div className="subtext">{t('Enter password from SMS')}</div>
                <div className="input-block ">
                    <input type="password" onChange={this.handlePasswordChange} value={this.state.password} onKeyPress={this.handleKeyPress}/>
                </div>
                <div className="subtext-confirm">{t('SMS sent')}</div>
                <div className="tac">
                    <Button title={t('Continue')} isPrimary isLarge isFluid onClick={this.handleSubmit}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        login: state.sign.login,
    };
};

export default connect(mapStateToProps, { passwordConfirm, showSignPopup })(ConfirmPasswordPopup);
