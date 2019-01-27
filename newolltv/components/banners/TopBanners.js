import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { showSignPopup } from '../../actions/sign';
import { POPUP_TYPE_SIGN_UP } from '../../constants';
import { inflect } from '../../helpers/string';
import t from '../../i18n';

class TopBanners extends Component {
    static propTypes = {
        showSignPopup: PropTypes.func,
        trial: PropTypes.object,
        signed: PropTypes.bool,
        bannerSmall: PropTypes.bool,
        specialOffer: PropTypes.number,
        pathname: PropTypes.string,
    };
    constructor(props) {
        super(props);

        this.state = {
            bannerSmall: false,
        };
        if ((('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))) {
            this.state.isMobile = true;
        }
    }

    addMar = () => {
        const { bannerSmall, isMobile } = this.state;
        return !isMobile && bannerSmall && !this.props.pathname ? ' paddingAdd' : '';
    };

    getBannerPosition = () => {
        const top = this.banner.getBoundingClientRect().top;
        const headerHeight = getComputedStyle(this.banner).top;
        const scroll = window.pageYOffset + parseInt(headerHeight, 10);
        const position = top + window.pageYOffset;
        const bannerSmall = scroll === position;
        if (this.state.bannerSmall !== bannerSmall) {
            this.setState({ bannerSmall });
        }
    };
    componentDidMount() {
        if (this.banner) {
            document.addEventListener('scroll', this.getBannerPosition, true);
        }
    }
    componentWillUnmount() {
        document.removeEventListener('scroll', this.getBannerPosition, true);
    }

    getDaysAccess = () => {
        const { signed, trial } = this.props;

        if (signed || !trial.sec) {
            return null;
        }
        const days = (trial.sec / 86400) | 0; // 7 days
        return (
            <div className={'gtm-days-free-access-click container main-banner' + this.addMar()}>
                <div className="gtm-days-free-access-click days-acces">
                    <h1>{days}</h1>
                    <div className="gtm-days-free-access-click info-txt">
                        <h3>{`${inflect(days, t('inflect_days'))} ${t('of free access')}`}</h3>
                        <h4>{t('after registration')}</h4>
                    </div>
                </div>
                <div className="rounds">
                    <span>{t('Sign Up')}</span>
                </div>
            </div>
        );
    };
    getSpecialOffer = () => {
        const { signed, specialOffer  } = this.props;

        if (!signed || !specialOffer) {
            return null;
        }
        return (
            <div className={'container main-banner' + this.addMar()}>
                <div className="special-offer">
                    <h1>9,99 <small>грн <span className="line">2 {t('week')}</span></small></h1>
                    <div className="info-txt">
                        <h2>{t('any package')}</h2>
                        <span className="star-violet">{t('Special offer')}</span>
                    </div>
                </div>
                <div className="rounds">
                    <span>{t('Choose package')}</span>
                </div>
            </div>
        );
    };

    goLink = () => {
        const { showSignPopup, signed, trial, specialOffer  } = this.props;
        let expires = new Date();

        if (!signed || trial.sec) {
            return showSignPopup(POPUP_TYPE_SIGN_UP);
        }
        if (signed || specialOffer) {
            expires.setTime(expires.getTime() + 43200000); // 12 hours
            document.cookie = 'trialInformer=1; expires=' + expires.toGMTString() + '; path=/';

            return window.location.assign('http://' + window.location.hostname + '/go');
        }
    };

    render() {
        const { bannerSmall, isMobile } = this.state;
        const fixedClass = !isMobile || this.props.pathname ? ' section-banner-fixed' : '';
        const smallClassName = !isMobile && bannerSmall || this.props.pathname ? ' smallBanner' : '';

        return (
            <div className={'section section-banner' + fixedClass + smallClassName} ref={el => this.banner = el} onClick={() => this.goLink()}>
                {this.getDaysAccess()}
                {this.getSpecialOffer()}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        signed: state.auth.signed,
        trial: state.app.trial || {},
        specialOffer: state.auth.user.specialOffer,
    };
};
export default connect(mapStateToProps, { showSignPopup })(TopBanners);
