import React from 'react';
import PropTypes from 'prop-types';
import { PLAYING, ABORT, ERROR } from '../../containers/Video';
import Button from '../Button';
import t from '../../i18n';

export default function PlayPauseBtn({ showSecondButton, secondMediaWasLoaded, media, getMedia, player, secondButtonTitle, secondButtonAction, showToStartBtn, onClickToStartBtn }) {
    if (media.isLoading) {
        return null;
    }
    let secondBtn, secondBtnClassName, secondBtnOnClick;
    if (showSecondButton) {
        secondBtnClassName = 'trailer in-play-pause' + (secondMediaWasLoaded && player && player.state === PLAYING ? ' pause' : '');
        secondBtnOnClick = e => {
            e.stopPropagation();
            if (secondMediaWasLoaded && canPlayPause(player)) {
                player.playPause();
            } else {
                secondButtonAction();
            }
        };
        secondBtn = <div><Button isDefault withIcon isSmall customClassName={'player-second-btn ' + secondBtnClassName} title={secondButtonTitle} onClick={secondBtnOnClick}/></div>;
    }
    let playPauseBtnClass = !secondMediaWasLoaded && player && player.state === PLAYING ? 'pause-btn' : 'play-btn',
        playPauseBtnOnClick = e => {
            e.stopPropagation();
            if (!secondMediaWasLoaded && media.item.mediaUrl && canPlayPause(player)) {
                player.playPause();
            } else {
                getMedia();
            }
        },
        startBtn = !showToStartBtn ? null : <div>
            <Button isDefault withIcon isSmall customClassName="previous-btn" title={t('To start')} onClick={onClickToStartBtn} />
        </div>;

    return (
        <div className="player-overlay-middle">
            {player && (player.state === ABORT || player.state === ERROR) ? <div className="upsale_text upsale_text_second">{t('Content temporary unavailable')}</div> : null}
            <div>
                <div className={playPauseBtnClass} onClick={playPauseBtnOnClick}/>
            </div>
            {secondBtn}
            {startBtn}
        </div>
    );
}

function canPlayPause(player)  {
    return player && player.state !== ABORT && player.state !== ERROR;
}

PlayPauseBtn.propTypes = {
    media: PropTypes.object.isRequired,
    getMedia: PropTypes.func.isRequired,
    player: PropTypes.object,
    secondButtonAction: PropTypes.func,
    secondButtonTitle: PropTypes.string,
    showSecondButton: PropTypes.bool,
    secondMediaWasLoaded: PropTypes.bool,
    showToStartBtn: PropTypes.bool,
    onClickToStartBtn: PropTypes.func,
};
