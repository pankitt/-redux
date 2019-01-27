import React from 'react';
import { Link } from 'react-router-dom';
import t from '../../../i18n';
import { checkContentIsAvailable, NOT_AUTH, CAN_PLAY, NEED_BUY_SUBS, NEED_UPGRADE_SUBS } from '../../../helpers/checkContentIsAvailable';

export function showOverlay(auth, purchased) {
    switch (checkContentIsAvailable(auth, purchased)) {
        case NOT_AUTH:
            return showLogin();
        case CAN_PLAY:
            return null;
        case NEED_UPGRADE_SUBS:
            return showUpsaleLight(auth.user.subs.light.tariffs[0].description);
        case NEED_BUY_SUBS:
            return showUpsalePremium();
        default:
            return null;
    }
}

export function showUpsalePremium() {
    return (
        <div className="upsale">
            <div className="upsale-content">
                <p>{t('Get access to TV channels')}<br/>
                    {t('and to LIVE')}</p>
                <Link className="btn large" to={'/subscribe'}>{t('Subscribe')}</Link>
            </div>
        </div>
    );
}

export function showUpsaleLight(text) {
    return (
        <div className="upsale">
            <div className="upsale-content">
                <p>{text}</p>
                <Link className="btn large" to={'/subscribe'}>{t('Subscribe')}</Link>
            </div>
        </div>
    );
}

export function showLogin() {
    return (
        <div className="upsale">
            <div className="upsale-content">
                <p>{t('Viewing available for subscription')}</p>
                <Link className="btn large" to={'/login'}>{t('Sign in')}</Link>
            </div>
        </div>
    );
}

export function showGeoIssue() {
    return (
        <div className="upsale">
            <div className="upsale-content">
                <div className="geo">{t('Viewing outside Ukraine is not available')}</div>
            </div>
        </div>
    );
}

export function showConnectionIssue() {
    return (
        <div className="upsale">
            <div className="upsale-content">
                <div className="connection">{t('Could not play content')}</div>
                <div className="tac">
                    <Link className="btn large default" to={'/login'}>{t('Try again')}</Link>
                </div>
            </div>
        </div>
    );
}
