import React, { Component } from 'react';
import PropTypes from 'prop-types';
import t from '../i18n';


export default class Error extends Component {
    static propTypes = {
        location: PropTypes.object,
        code: PropTypes.number,
        message: PropTypes.string,
    }

    componentDidMount() {
        document.title = t('meta_title_items_list_404');
    }

    render() {
        const { message, code } = this.props;
        return (
            <div className="page-error">
                <div className="error-content">
                    <div className="error-poster"></div>
                    <div className="error-message-header">{code === 400 ? t('Error') + ' 404' : code}</div>
                    <div className="error-message-text">{code === 400 ? t('Page not found') : message}</div>
                </div>
            </div>
        );
    }
}
