import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router';
import '../markup/scss/common.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import BlocksList from './BlocksList';
import Channels from './Channels';
import Feedback from './Feedback';
import Bundles from './Bundles';
import Payment from './Payment';
import PaymentResult from './PaymentResult';
import Banking from './Banking';
import Football from './Football';
import FootballMatch from './FootballMatch';
import Help from './Help';
import Home from './Home';
import ItemsList from './ItemsList';
import Profile from './Profile';
import Radio from './radio/Radio';
import Music from './Music';
import Sign from './Sign';
import Search from './Search';
import Static from './Static';
import VodItem from './VodItem';
import map from 'lodash/map';
import { setLocale } from '../actions/settings';
import TopBanners from '../components/banners/TopBanners';
import ViewHistory from './account/ViewHistory';

const show7dayTrialUpsaleExcludeUrlsReg = /(^\/$)|(football)|(premium)|(amedia)|(ivi)|(go)|(payment)|(search)/;

const landingUrls = [
    'kinoman_megahit',
    'kinoman_kino',
    'kinoman_efir',
    'kinoman_discount',
    'kinoman_1hrn_lp',
];


class App extends Component {
    static propTypes = {
        initialized: PropTypes.bool,
        locale: PropTypes.string,
        location: PropTypes.object,
        history: PropTypes.object,
        config: PropTypes.object,
        setLocale: PropTypes.func.isRequired,
        senderWidget: PropTypes.object,
        pathname: PropTypes.string,
    };

    handleFooterWidgetClick = () => {
        SenderWidget.showWidget();
    }

    componentDidMount() {
        if ((('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))) {
            document.body.classList.add('touch');
        }
    }

    componentDidUpdate(prevProps) {
        if (!window.senderCallback && this.props.senderWidget && !prevProps.senderWidget) {
            /* global SenderWidget */
            window.senderCallback = () => {
                SenderWidget.init({
                    ...this.props.senderWidget,
                });
            };
            const fjs = document.getElementsByTagName('script')[0];
            const js = document.createElement('script');
            js.src = 'https://widget.sender.mobi/build/init.js';
            fjs.parentNode.insertBefore(js, fjs);
        }
    }

    render() {
        if (!this.props.initialized) return null;
        const { config:{ menu }, pathname } = this.props;
        const topBanner = !show7dayTrialUpsaleExcludeUrlsReg.test(pathname) ? <TopBanners pathname={pathname} key="bn"/> : null;
        return (
            <div className="app">
                <Switch>
                    {map(landingUrls, url => {
                        return <Route exact path={'/' + url + 'index.html'} onEnter={window.location.reload} key={url}/>;
                    })}
                </Switch>
                <Header {...this.props} key="h"/>
                <div className="content">
                    {topBanner}
                    <Route children={({ location: { pathname } }) => pathname.length > 1 && pathname[pathname.length - 1] === '/' ?  <Redirect strict exact to={pathname.slice(0, -1)} /> : null} />
                    <Switch>
                        <Route strict exact path="/" component={Home}/>
                        <Route strict exact path="/account/history/:type?" component={ViewHistory} />
                        <Route strict exact path="/search" component={Search} />
                        <Route strict exact path="/go/:type?" component={Bundles} />
                        <Route strict exact path="/payment/result" component={PaymentResult} />
                        <Route strict exact path="/payment/go/:tariffs" component={Banking} />
                        <Route strict exact path="/payment/:id" component={Payment} />
                        <Route strict exact path="/football" component={Football}/>
                        <Route strict exact path="/football/:id/:highlightId?" component={FootballMatch}/>
                        <Route strict exact path="/channels" component={Channels}/>
                        <Route strict exact path="/channels/:id/:programId?" component={Channels}/>
                        <Route strict exact path="/radio/:id?" component={Radio} />
                        <Route strict exact path="/clips/:url" component={Music} />
                        <Route strict exact path="/profile" component={Profile}/>
                        <Route strict exact path="/help/:topic?" component={Help}/>
                        <Route strict exact path="/feedback" component={Feedback}/>
                        {map(['terms', 'about'], id => {
                            return <Route strict exact path={'/' + id} render={() => <Static id={id} />} key={id}/>;
                        })}
                        {map(menu, (item, key) => {
                            if (item.inMenu === 1 && key !== 'olltv') {
                                return <Route strict exact path={'/' + item.route} render={props => <BlocksList {...props} id={key} type="" key={key}/> }/>;
                            }
                        })}
                        <Route strict exact path={'/:category'} render={props => <ItemsList {...props} id={props.match.params.category} type="" key={'olltv'}/>} />
                        {map(menu, (item, key) => {
                            if (item.inMenu !== 1 && key !== 'olltv') {
                                return <Route strict exact path={'/:category/' + key} render={props => <ItemsList {...props} id={props.match.params.category} type={key} key={key} />} />;
                            }
                        })}
                        <Route strict path="/collections/:url" render={props => <ItemsList {...props} id={props.match.params.category}/>}/>
                        <Route strict path="/:category/collections/:url" render={props => <ItemsList {...props} id={props.match.params.category}/>}/>
                        <Route strict path="/:category/:seriesId(\d+)/:seasonId(\d+)/:url" render={props => <VodItem {...props}/>}/>
                        <Route strict path="/:category/:type(\w+)/:seriesId(\d+)/:seasonId?/:url" render={props => <VodItem {...props}/>}/>
                        <Route strict path="/:category/:seriesId(\d+)/:seasonId?/:url" render={props => <VodItem {...props}/>}/>
                        <Route strict path="/:category/:type(\w+)/:url" render={props => <VodItem {...props}/>}/>
                        <Route strict path="/:category/:url" render={props => <VodItem {...props}/>}/>
                    </Switch>
                </div>
                <Footer setLocale={this.props.setLocale} locale={this.props.locale} pathname={this.props.location.pathname} onWidgetClick={this.handleFooterWidgetClick} search={this.props.location.search}/>
                <Sign />
                <ScrollToTop location={this.props.location} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        senderWidget: state.app.senderWidget,
        initialized: state.app.initialized,
        locale: state.settings.locale,
        config: state.config,
        pathname: ownProps.location.pathname,
    };
};

export default withRouter(connect(mapStateToProps, { setLocale })(App));
