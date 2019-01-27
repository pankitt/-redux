import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import t, { languages } from '../i18n';
import map from 'lodash/map';
import { connect } from 'react-redux';
import { POPUP_TYPE_CALL_BACK } from '../constants';
import { showSignPopup } from '../actions/sign';

class Footer extends Component {
    static propTypes = {
        locale: PropTypes.string.isRequired,
        setLocale: PropTypes.func.isRequired,
        pathname: PropTypes.string.isRequired,
        search: PropTypes.string,
        showSignPopup: PropTypes.func,
        onWidgetClick: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            docsPopup: false,
        };
    }

    // shouldComponentUpdate() {
    //     return false;
    // }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    changeLang(locale) {
        this.props.setLocale(locale);
        console.log(this.props);
        window.location.replace(window.location.origin + '/' + locale + this.props.pathname + (this.props.search || ''));
    }

    toggleDocsPopup = () => {
        this.setState({
            docsPopup: !this.state.docsPopup,
        });
    }

    handleClickOutside = (event) => {
        const { docsPopup } = this.state;
        if ((!this.popup || !this.popup.contains(event.target))) {
            if (docsPopup) {
                this.setState({
                    docsPopup: false,
                });
            }
        }
    }

    render() {
        const { docsPopup } = this.state;

        return (
            <div className="footer">
                <div className="container rel">
                    <div className="footer-left footer-col">
                        <div>
                            <Link to="/" className="footer-logo"/>
                        </div>
                        <div className="copyright">{t('All rights reserved') + ' © ' + (new Date()).getFullYear()}</div>
                        <ul>
                            {map(languages, lang => <li className={'language' + (lang.code === this.props.locale ? ' active' : '')} onClick={lang.code === this.props.locale ? null : () => this.changeLang(lang.code)}>{lang.shortName}</li>)}
                        </ul>
                    </div>
                    <div className="footer-links footer-col">
                        <div>
                            <Link to="/help">{t('Help')}</Link>
                        </div>
                        <div>
                            <Link to="/feedback">{t('Feedback')}</Link>
                        </div>
                        <div>
                            <Link to="/terms">{t('Offer')}</Link>
                        </div>
                        <div className="ownership-docs-wrapper">
                            <div onClick={this.toggleDocsPopup} className="ownership-docs">{t('Ownership structure')}</div>
                            {docsPopup ? <div className="docs-popup" ref={el => this.popup = el}>
                                <a className="doc" href="http://i.ollcdn.net/39e01c388298e43e6e60d80ea2be1160aea39b44/documents/2016_03_30_struktura_vlasnosti_DS.pdf" target="_blank" rel="noopener noreferrer">
                                    <div className="doc-year">2015</div>
                                    <div className="doc-type">pdf</div>
                                </a>
                                <a className="doc" href="http://i.ollcdn.net/39e01c388298e43e6e60d80ea2be1160aea39b44/documents/2017_03_14_DS_struktura_vlasnosti.pdf" target="_blank" rel="noopener noreferrer">
                                    <div className="doc-year">2016</div>
                                    <div className="doc-type">pdf</div>
                                </a>
                                <a className="doc" href="http://i.ollcdn.net/39e01c388298e43e6e60d80ea2be1160aea39b44/documents/31_12_2017_struktura_vlasnosti_DS.pdf" target="_blank" rel="noopener noreferrer">
                                    <div className="doc-year">2017</div>
                                    <div className="doc-type">pdf</div>
                                </a>
                            </div> : null}
                        </div>
                        <div>
                            <Link to="/about">{t('About')}</Link>
                        </div>
                        <div>
                            <a href="https://www.blog.oll.tv/" target="_blank" rel="noopener noreferrer">{t('OLL.TV blog')}</a>
                        </div>
                        <div>
                            <Link to="/go">{t('Tariffs')}</Link>
                        </div>
                    </div>
                    <div className="footer-contact footer-col">
                        <div>
                            <a href="tel:0800300032" className="tel">0 800 30-00-32</a>
                        </div>
                        <p>{t('Free for Ukraine')}</p>
                        <div className="socials">
                            <a href="https://www.facebook.com/OLL.TV/" target="_blank" rel="noopener noreferrer" className="soc fb"/>
                            <a href="https://www.instagram.com/olltv/" target="_blank" rel="noopener noreferrer" className="soc ig"/>
                        </div>
                    </div>
                    <div className="footer-right">
                        <div className="help-block">
                            <div className="help help-online" onClick={this.props.onWidgetClick}>{t('Online help')}</div>
                            <div className="help call-back" onClick={() => this.props.showSignPopup(POPUP_TYPE_CALL_BACK)}>{t('Callback')}</div>
                        </div>
                    </div>
                </div>
                <div className="container badges">
                    <a className="badge apple" href="https://itunes.apple.com/ua/app/oll-tv/id1021522360?l=ru&mt=8" target="_blank" rel="noopener noreferrer"></a>
                    <a className="badge google" href="https://play.google.com/store/apps/details?id=tv.oll.app&hl=ru" target="_blank" rel="noopener noreferrer"></a>
                </div>
            </div>
        );
    }
}

export default connect(null, { showSignPopup })(Footer);
