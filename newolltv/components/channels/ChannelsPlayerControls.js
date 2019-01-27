import React from 'react';
import PropTypes from 'prop-types';
import { LOADSTART, STOPPED, PAUSE } from '../../containers/Video';
import VideoStatistics from '../VideoStatistics';
import t from '../../i18n';
import Progress from '../player/Progress';
import Preferences from '../player/Preferences';
import FullScreenButton from '../player/FullScreenButton';
import Volume from '../player/Volume';
import PlayPauseBtn from '../player/PlayPauseBtn';
import Loading from '../player/Loading';

export default function ChannelPlayerControls({ video, media, getMedia, switchToLive, item, poster, playerUI }) {
    return (
        <div className={playerUI.visible ? null : 'dn' }>
            { poster ? <div className="player-poster blur" style={{ backgroundImage: 'url(' + item.poster + ')' }} /> : null}
            {media.isLoading || video.state === LOADSTART ?
                <Loading/> :
                <PlayPauseBtn
                    media={media}
                    player={video}
                    secondButtonTitle={t('Back to Live')}
                    secondButtonAction={switchToLive}
                    getMedia={getMedia}
                    showSecondButton={!item.isOwn && (media.item.id !== item.id || video.state === PAUSE)}
                />
            }
            {media.item.stat ? <VideoStatistics media={media.item} currentTime={video.currentTime} playerState={video.state} /> : null}
            {video.state !== STOPPED ?
                <div className="player-overlay-bottom">
                    <div className="player-controls">
                        <div className="container rel">
                            { !item.isOwn && media.item.id !== item.id ? <Progress currentTime={video.currentTime} duration={video.duration} seek={video.seek} seeking={video.seeking}/> : null }
                            <FullScreenButton switchFullscreen={playerUI.switchFullscreen} fullscreenEnabled={playerUI.fullscreenEnabled}/>
                            <Volume volume={video.volume} muted={video.muted} setVolume={video.setVolume} mute={video.mute} />
                            <Preferences player={video} playerUI={playerUI} />
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    );
}

ChannelPlayerControls.propTypes = {
    video: PropTypes.object.isRequired,
    media:  PropTypes.object.isRequired,
    getMedia: PropTypes.func.isRequired,
    switchToLive: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    poster: PropTypes.string,
    playerUI: PropTypes.object.isRequired,
};
