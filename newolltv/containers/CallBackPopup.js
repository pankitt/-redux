import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { ORDER_CALLBACK_SUCCESS, ORDER_CALLBACK_FAILURE } from '../actions/backcall';
import t from '../i18n';

export class CallBackPopup extends Component {
    static propTypes = {
        onClose: PropTypes.func,
        orderCallback: PropTypes.func,
        onLinkClick: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            tel: '+380',
            order: false,
            error: false,
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.orderCallback(this.state.tel).then(action => {
            switch (action.type) {
                case ORDER_CALLBACK_SUCCESS:
                    this.setState({ order: true });
                    break;
                case ORDER_CALLBACK_FAILURE:
                    this.setState({ error: true });
                    break;
            }
        });
    };

    handleTelChange = (e) => {
        this.setState({ tel: e.target.value });
    };

    render() {
        const innerHTML = this.state.order ? (
            <div>
                <div className="subtext">{t('We will call you back in 2 minutes to {tel}', { tel: this.state.tel })}</div>
                <Button title="Ok" isPrimary isLarge isFluid onClick={this.props.onClose}/>
            </div>
        ) : (
            <div>
                <div className="input-block">
                    <label className="">{t('Phone number')}</label>
                    <input type="tel" onChange={this.handleTelChange} value={this.state.tel} />
                </div>
                <div className="error-block">
                    {this.state.error ? <div className="error">{t('wrong phone format')}</div> : null}
                </div>
                <Button title={t('To order')} isPrimary isLarge isFluid onClick={this.handleSubmit}/>
            </div>
        );
        return (
            <div className="sign-popup repair-password callBack-popup">
                <span className="call" />
                <div className="close" onClick={this.props.onClose}/>
                <h3 className="title">{t('Callback')}</h3>
                {innerHTML}
            </div>
        );
    }
}
