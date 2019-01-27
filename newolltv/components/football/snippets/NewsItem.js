import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import t from '../../i18n';

export default class NewsItem extends Component {
    static propTypes = {
        previewCover: PropTypes.string,
        customClassName: PropTypes.string,
        title: PropTypes.string,
        subTitle: PropTypes.string,
        createdAt: PropTypes.string,
    }
    _createSubtitle = (subTitle) => {
        return {
            __html : subTitle,
        };
    }
    _setArticleDate = (date) => {
        return moment(date, 'YYYY-MM-DD hh:mm:ss').calendar(null, {
            sameDay: t('Today') + ', D MMMM, dd',
            lastDay: t('Yesterday') + ', D MMMM, dd',
            nextDay: t('Tomorrow') + ', D MMMM, dd',
            sameElse: 'D MMMM, dd',
            nextWeek: 'D MMMM, dd',
            lastWeek: 'D MMMM, dd',
        });
    }
    render() {
        const { previewCover, customClassName, title, createdAt, subTitle } = this.props;
        return (
            <div className={ 'news-item ' + customClassName}>
                <div className="with-img" style={{ backgroundImage: 'url(' + previewCover + ')' }} />
                <div className="news-item-data">
                    <div className="title">{title}</div>
                    <div className="subtitle" dangerouslySetInnerHTML={this._createSubtitle(subTitle)}/>
                    <div className="date">{this._setArticleDate(createdAt)}</div>
                </div>
            </div>
        );
    }
}
