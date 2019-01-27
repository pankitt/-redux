import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../../i18n';

export default class Channel extends Component {
    static propTypes = {
        now: PropTypes.string,
        type: PropTypes.string,
        isOnFocus: PropTypes.bool,
    }

    render() {
        const { now, type, isOnFocus } = this.props;
        const focusClassName = isOnFocus ? 'focus' : '';
        return (
            <div className={ 'snippet channel football-' + type + ' ' + focusClassName}>
                <div className="logo"/>
                <div className="notice">
                    <span className="marker">{t('now')}</span>
                    { now }
                </div>
            </div>
        );
    }
}
