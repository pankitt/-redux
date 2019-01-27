import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { showSignPopup, hideSignPopup } from '../actions/sign';
import { login } from '../actions/auth';
import {
    POPUP_TYPE_SIGN_UP,
    POPUP_TYPE_PASSWORD_RESTORE,
} from '../constants';
import t from '../i18n';

class SignInPopup extends Component {
    static propTypes = {
        auth: PropTypes.object,
        showSignPopup: PropTypes.func,
        hideSignPopup: PropTypes.func,
        login: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            remember: true,
        };
    }

    componentDidMount() {
        this.loginInput.focus();
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.auth.signed && this.props.auth.signed) {
            this.props.hideSignPopup();
        }
    }

    handleLoginChange = e => {
        this.setState({ login: e.target.value });
    }

    handlePasswordChange = e => {
        this.setState({ password: e.target.value });
    }

    handleSubmit = () => {
        this.props.login(this.state.login, this.state.password);
    }

    handleKeyPress= (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    setCheckbox = () => {
        this.setState({ remember: !this.state.remember });
    }

    render() {
        const { auth: { signInError } } = this.props;
        const checkedClassName = this.state.remember ? 'active' : '';
        return (
            <div className="sign-popup sign-in">
                <div className="close" onClick={this.props.hideSignPopup}/>
                <h3 className="title">{t('Sign In')}</h3>
                <div className="link switch-link" onClick={() => this.props.showSignPopup(POPUP_TYPE_SIGN_UP)}>{t('Registration')}</div>
                <div className="input-block ">
                    <div className="label">{t('Phone number or email')}</div>
                    <input type="text" onChange={this.handleLoginChange} value={this.state.login} ref={el => this.loginInput = el} key="0" onKeyPress={this.handleKeyPress}/>
                </div>
                <div className="input-block ">
                    <div className="label">{t('Password')}</div>
                    <input type="password" onChange={this.handlePasswordChange} value={this.state.password} onKeyPress={this.handleKeyPress}/>
                </div>
                <div className="with-checkbox">
                    <div className={'checkbox ' + checkedClassName} onClick={this.setCheckbox}/>
                    <div className="checkbox-label" onClick={this.setCheckbox}>{t('Remember me')}</div>
                </div>
                <div className="error-block">
                    {signInError ? <div className="error">{signInError.message}</div> : null}
                </div>
                <div className="tac">
                    <Button title={t('Sign in')} isPrimary isLarge isFluid onClick={this.handleSubmit} customClassName="gtm-authorize-btn-click"/>
                </div>
                <div className="tac">
                    <div className="repair" onClick={() => this.props.showSignPopup(POPUP_TYPE_PASSWORD_RESTORE)}>{t('Forgot password?')}</div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth || {},
    };
};

export default connect(mapStateToProps, { showSignPopup, hideSignPopup, login })(SignInPopup);
