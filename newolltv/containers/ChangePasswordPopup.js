import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { passwordChange } from '../actions/password';

export class ChangePasswordPopup extends Component {
    static propTypes = {
        onClose: PropTypes.func,
        passwordChange: PropTypes.func,
        token: PropTypes.string.isRequired,
        password: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            password: '',
        };
    }

    handlePasswordChange = e => {
        this.setState({ password: e.target.value });
    }

    handleKeyPress= (e) => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    handleSubmit = () => {
        this.props.passwordChange(this.props.token, this.state.password);
    }

    render() {
        return (
            <div className="sign-popup repair-password">
                <div className="close" onClick={this.props.onClose}></div>
                <h3 className="title">Восстановление пароля</h3>
                <div className="subtext">Введите новый пароль</div>
                <div className="input-block ">
                    <input type="password" onChange={this.handlePasswordChange} value={this.props.password} onKeyPress={this.handleKeyPress}/>
                </div>
                <div className="subtext">Пароль должен состоять минимум из 6 символов и содержать хотя бы одну букву и одну цифру</div>
                <div className="tac">
                    <Button title="Продолжить" isPrimary isLarge isFluid onClick={this.handleSubmit}/>
                </div>
            </div>
        );
    }
}

export default connect(null, { passwordChange })(ChangePasswordPopup);
