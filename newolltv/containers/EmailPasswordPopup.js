import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import t from '../i18n';

export class EmailPasswordPopup extends Component {
    static propTypes = {
        onClose: PropTypes.func,
    }

    render() {
        return (
            <div className="sign-popup confirm-password">
                <div className="close" onClick={this.props.onClose}/>
                <h3 className="title">{t('Password recovery')}</h3>
                <div>
                    <p>{t('We sent password recovery instruction on yor email.')}<br/><br/>
                        {t('If you still do not received email, please, check it in spam or write to as at')} <a href="mailto:info@oll.tv">info@oll.tv</a></p>
                </div>
            </div>
        );
    }
}

export default connect()(EmailPasswordPopup);
