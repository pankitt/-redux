import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Button from './Button';
import { showSignPopup } from '../actions/sign';
import { logout } from '../actions/auth';
import { POPUP_TYPE_SIGN_IN } from '../constants';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import t from '../i18n';


class Header extends Component {
    static propTypes = {
        logout: PropTypes.func,
        showSignPopup: PropTypes.func,
        config: PropTypes.object,
        pathname: PropTypes.string,
        auth: PropTypes.object,
        location: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            menu: this.createMenu(),
        };
    }

    handleMenuItemClick = () => {
        this.setState({ isOpen: false });
    }

    _handleHeaderButtonClick = () => {
        this.setState({ isOpen: false }, () => {
            this.props.showSignPopup(POPUP_TYPE_SIGN_IN);
        });
    }

    handleBurgerClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    createMenu = () => {
        const { config } = this.props;
        let menu = [];
        forEach(config.menu, item => {
            if (item.inMenu === 1) {
                menu.push({
                    path: (!item.route.startsWith('http') ? '/' : '') + item.route,
                    title: item.title,
                    route: item.route,
                });
            }
        });
        return menu;
    }

    isActive = (route) => {
        const { location:{ pathname } } = this.props;
        const page = pathname.split('/')[1];
        switch (page) {
            case '':
                return route === '';
            case 'channels':
                return route === 'channels';
            case 'movies-and-series':
            case 'film':
            case 'films':
            case 'serials':
            case 'premium':
                return route === 'movies-and-series';
            case 'programs':
            case 'programs/all':
                return route === 'programs/all';
            case 'kids':
            case 'kids/all':
                return route === 'kids/all';
            case 'football':
                return route === 'football';
            case 'music':
            case 'clips':
                return route === 'music';
            case 'go':
            case 'payment':
                return route === 'go';
            default:
                return false;
        }
    }

    withoutNav = () => (/(go)|(payment)/).test(this.props.pathname);

    render() {
        const { auth: { user }, location: { pathname } } = this.props;
        const { isOpen, menu } = this.state;

        return (
            <div className={isOpen ? 'header open' : 'header'}>
                <div className="burger-btn" onClick={this.handleBurgerClick}>
                    <svg className={isOpen ? 'burger active' : 'burger'} width="30px" height="30px" viewBox="0 0 30 30" version="1.1" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <rect className="burger_rect1" x="4" y="10" width="22" height="2" rx="1"/>
                        <rect className="burger_rect2" x="4" y="18" width="22" height="2" rx="1"/>
                    </svg>
                </div>

                <div className="container rel">
                    <Link to="/" className="nav-logo-mobile"  onClick={this.handleMenuItemClick}/>
                    <ul className="nav left">
                        {map(menu, (item, key) => {
                            const isHomeClassName = item.path === '/' ? 'nav-logo' : '';
                            const isActiveClassName = this.isActive(item.route) ? 'active' : '';

                            return (
                                <li key={key}>{item.path.startsWith('http') ?
                                    <a href={item.path} className={isHomeClassName + ' ' + isActiveClassName} onClick={this.handleMenuItemClick}>{item.title}</a> :
                                    <Link to={item.path} className={isHomeClassName + ' ' + isActiveClassName} onClick={this.handleMenuItemClick}>{item.title}</Link>
                                }
                                </li>
                            );
                        })}
                        <li>
                            <Link to="/search" className={'nav-icon search ' + (pathname === '/search' ? 'active' : '')} onClick={this.handleMenuItemClick}></Link>
                        </li>
                    </ul>
                    <div className="nav right">
                        {user && user.id && user.id !== 0 ?
                            <div className="to-account-with-logout">
                                <div className="logout" onClick={this.props.logout}>{t('Sign out')}</div>
                                <a href={'http://' + window.location.hostname + '/account/'} className="nav-icon userpic"/>
                            </div> :
                            <Button title={t('Sign in')} isSmall isDefault onClick={this._handleHeaderButtonClick}/> }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        config: state.config,
        auth: state.auth,
    };
};

export default withRouter(connect(mapStateToProps, { showSignPopup, logout })(Header));
