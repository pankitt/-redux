import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../i18n';

export class MessageSentPopup extends Component {
    static propTypes = {
        onClose: PropTypes.func,
    };

    render() {
        return (
            <div className="sign-popup confirm-password">
                <div className="close" onClick={this.props.onClose}/>
                <h3 className="title">{t('Feedback')}</h3>
                <div>
                    <p>{t('Your message has been sent. We will contact you shortly.')}</p>
                </div>
            </div>
        );
    }
}

export default MessageSentPopup;