import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { POPUP_TYPE_SIGN_IN } from '../constants';
import { showSignPopup, hideSignPopup, signup } from '../actions/sign';
import t from '../i18n';

class SignUpPopup extends Component {
    static propTypes = {
        signUpError: PropTypes.object,
        showSignPopup: PropTypes.func,
        hideSignPopup: PropTypes.func,
        signup: PropTypes.func,
    }
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            email: '',
            agree: true,
        };
    }
    componentDidMount() {
        this.phoneInput.focus();
    }

    handlePhoneChange = e => {
        this.setState({ phone: e.target.value });
    }

    handleEmailChange = e => {
        this.setState({ email: e.target.value });
    }

    handleKeyPress= (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.signup(this.state.phone, this.state.email);
    }

    setCheckbox = () => {
        this.setState({ agree: !this.state.agree });
    }
    render() {
        const { signUpError } = this.props;
        const checkedClassName = this.state.agree ? 'active' : '';
        return (
            <div className="sign-popup sign-in">
                <div className="close" onClick={this.props.hideSignPopup}/>
                <h3 className="title">{t('Registration')}</h3>
                <div className="link switch-link" onClick={() => this.props.showSignPopup(POPUP_TYPE_SIGN_IN)}>{t('Sign In')}</div>
                <div className="input-block">
                    <div className="label">{t('Your phone number')}</div>
                    <input type="text" onChange={this.handlePhoneChange} value={this.state.phone} ref={el => this.phoneInput = el} onKeyPress={this.handleKeyPress} key="0"/>
                </div>
                <div className="input-block">
                    <div className="label">{t('Your email')}</div>
                    <input type="email" onChange={this.handleEmailChange} value={this.state.email} onKeyPress={this.handleKeyPress}/>
                </div>
                <div className="with-checkbox">
                    <div className={'checkbox ' + checkedClassName} onClick={this.setCheckbox}/>
                    <div className="checkbox-label" onClick={this.setCheckbox}>{t('Receive news and special offers')}</div>
                </div>
                <div className="error-block">
                    {signUpError ? <div className="error">{signUpError.message}</div> : null}
                </div>
                <div className="tac">
                    <Button title={t('Continue')} isPrimary isLarge isFluid onClick={this.handleSubmit} customClassName="gtm-registration-btn-click"/>
                    <div className="subtext">{t('Press the button "Continue" you')}<br />{t('confirm with')} <Link to={'/terms'} className="link" onClick={this.props.hideSignPopup}>{t('user agreements')}</Link></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        signUpError: state.auth.signUpError || {},
    };
};

export default connect(mapStateToProps, { showSignPopup, hideSignPopup, signup })(SignUpPopup);
