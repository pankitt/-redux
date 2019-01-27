import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
// import { goPayment } from '../../helpers/lincksToOldOllTV';
import t from '../../i18n';
import { inflect } from '../../helpers/string';
import { POPUP_TYPE_SIGN_UP } from '../../constants';
import { PLAYING } from '../../containers/Video';

export default function UpSale(props) {
    const trailer = props.trailerId ? { player: props.player, getTrailerMedia: props.getTrailerMedia } : null;

    if (!props.auth.signed) {
        if (props.isAmedia || props.isIvi && props.subs) {
            return <UpSaleContent
                firstTitle={`${t('Watch')} ${t('in subscription')}`}
                secondTitle={props.subs.name}
                buttonTitle={t('Sign Up')}
                onClick={() => props.showSignPopup(POPUP_TYPE_SIGN_UP)}
                trailer={trailer}
                buttonClassName={'gtm-click-registrate'}
            />;
        }

        if (!props.isPremium && !props.isFootball && props.auth.user.trialDuration) {
            return <UpSaleContent
                firstTitle={t('Register and watch')}
                secondTitle={`${props.auth.user.trialDuration / 86400} ${inflect(props.auth.user.trialDuration / 86400, t('inflect_days'))} ${t('free')}`}
                buttonTitle={t('Sign Up')}
                onClick={() => props.showSignPopup(POPUP_TYPE_SIGN_UP)}
                trailer={trailer}
                buttonClassName={'gtm-click-registrate'}
            />;
        }

        return <UpSaleContent
            secondTitle={t('Register for watching')}
            buttonTitle={t('Sign Up')}
            onClick={() => props.showSignPopup(POPUP_TYPE_SIGN_UP)}
            trailer={trailer}
            buttonClassName={'gtm-click-registrate'}
        />;
    }

    if (props.isPremium && props.subs) {
        return <UpSaleContent
            secondTitle={`${t('Watching for')} 7 ${inflect(7, t('inflect_days'))}`}
            buttonTitle={t('Buy')}
            onClick={e => {
                e.stopPropagation();
                props.history.push('/payment/' + props.subs.subsId);
            }}
            trailer={trailer}
            buttonClassName={'gtm-click-buy'}
        />;
    }

    if (props.subs) {
        return <UpSaleContent
            firstTitle={`${t('Watch')} ${t('in subscription')}`}
            secondTitle={props.subs.name}
            buttonTitle={t('Buy')}
            onClick={e => {
                e.stopPropagation();
                props.history.push('/payment/' + props.subs.subsId);
            }}
            trailer={trailer}
            buttonClassName={'gtm-click-buy'}
        />;
    }

    return (
        <div className="player-overlay-middle">
            <div className="upsale_text upsale_text_second">{t('Content temporary unavailable')}</div>
        </div>
    );
}

UpSale.propTypes = {
    auth: PropTypes.object.isRequired,
    showSignPopup: PropTypes.func.isRequired,
    subs: PropTypes.object,
    isPremium: PropTypes.bool,
    isFootball: PropTypes.bool,
    isAmedia: PropTypes.bool,
    isIvi: PropTypes.bool,
    trailerId: PropTypes.number,
    player: PropTypes.object,
    getTrailerMedia: PropTypes.func,
    history: PropTypes.instanceOf(History).isRequired,
};

function UpSaleContent(props) {
    return (
        <div className="player-overlay-middle">
            {props.firstTitle ? <div className="upsale_text upsale_text_first">{props.firstTitle}</div> : null}
            <div className="upsale_text upsale_text_second">{props.secondTitle}</div>
            <div>
                <Button isPrimary isLarge title={props.buttonTitle} onClick={props.onClick} customClassName={props.buttonClassName}/>
            </div>
            {props.trailer ? <div><TrailerBtn {...props.trailer} key="t" /></div> : null}
        </div>
    );
}

UpSaleContent.propTypes = {
    firstTitle: PropTypes.string,
    secondTitle: PropTypes.string.isRequired,
    buttonTitle: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    trailer: PropTypes.object,
    buttonClassName: PropTypes.string,
};

function TrailerBtn(props) {
    return <Button
        isDefault
        withIcon
        isSmall
        customClassName={props.player && props.player.state === PLAYING ? 'trailer pause' : 'trailer'}
        title={t('Trailer')}
        onClick={props.player ? props.player.playPause : props.getTrailerMedia}/>;
}

TrailerBtn.propTypes = {
    player: PropTypes.object,
    getTrailerMedia: PropTypes.func,
};
