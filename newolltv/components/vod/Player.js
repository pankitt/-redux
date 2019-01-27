import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Player from '../player/Player';
import Video, { STOPPED, LOADSTART } from '../../containers/Video';
import { getMedia, clearMedia } from '../../actions/media';
import { getIviMedia } from '../../actions/iviService';
import { saveVolumeSettings } from '../../actions/settings';
import { updateVideoPosition } from '../../actions/videoItem';
import VideoStatistics from '../VideoStatistics';
import { showSignPopup } from '../../actions/sign';
import UpSale from '../player/UpSale';

import Actors from './Actors';
import Progress from '../player/Progress';
import Preferences from '../player/Preferences';
import FullScreenButton from '../player/FullScreenButton';
import Volume from '../player/Volume';
import Poster from '../player/Poster';
import PlayPauseBtn from '../player/PlayPauseBtn';
import SwitchContentButton from '../player/SwitchContentButton';
import Tags from './Tags';
import Loading from '../player/Loading';

class VodPlayer extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        media: PropTypes.object.isRequired,
        mediaId: PropTypes.number.isRequired,
        volumeSettings: PropTypes.object.isRequired,
        saveVolumeSettings: PropTypes.func.isRequired,
        getMedia: PropTypes.func.isRequired,
        getIviMedia: PropTypes.func.isRequired,
        clearMedia: PropTypes.func.isRequired,
        updateVideoPosition: PropTypes.func.isRequired,
        currentSeason: PropTypes.object,
        currentEpisode: PropTypes.object,
        prevItem: PropTypes.object,
        onPrevItemClick: PropTypes.func,
        nextItem: PropTypes.object,
        onNextItemClick: PropTypes.func,
        history: PropTypes.object,
        showSignPopup: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
        seekTime: PropTypes.number,
    };

    state = {
        playerState: STOPPED,
    };

    onStateChange = state => {
        if (this.state.playerState !== state) {
            this.setState({ playerState: state });
        }
    }

    onTimeUpdate = (currentTime, duration) => {
        if (currentTime % 10 === 0 && this.props.media.item.id === this.props.mediaId) {
            this.updatePosition(currentTime, duration);
        }
    };

    updatePosition = (currentTime, duration) => {
        let percentage = duration ? parseInt((currentTime / duration) * 100, 10) : 0;
        this.props.updateVideoPosition(this.props.mediaId, currentTime, percentage);
    };

    getMedia = () => {
        if (this.props.media.isLoading) {
            return;
        }

        if (this.props.item.isIvi) {
            this.props.getIviMedia(this.props.mediaId);
            return;
        }

        this.props.getMedia(this.props.mediaId);
    };

    getTrailerMedia = () => {
        if (this.props.media.isLoading) {
            return;
        }
        this.props.getMedia(this.props.item.trailers[0].id);
    };

    clickToStartBtn = (player) => {
        this.updatePosition(0);
        if (player.state === STOPPED || this.props.media.item.id !== this.props.mediaId) {
            this.getMedia();
        } else {
            player.seek(0);
        }
    };

    componentWillUnmount() {
        const media = this.props.media;
        if (media.item || media.isLoading) {
            this.props.clearMedia();
        }
    }

    render() {
        const { media, item } = this.props;
        const trailerId = item.trailers && item.trailers.length ? item.trailers[0].id : null;
        return (
            <Player playerState={this.state.playerState}>
                {(playerUI) => {
                    return (
                        <Fragment>
                            {playerUI.canShowPoster(this.state.playerState) ? <Poster itemFrames={item.itemFrames}/> : null }
                            <Video
                                src={media.item.mediaUrl}
                                onVolumeChange={this.props.saveVolumeSettings}
                                volume={this.props.volumeSettings.volume}
                                muted={this.props.volumeSettings.muted}
                                onStateChange={this.onStateChange}
                                onTimeUpdate={this.onTimeUpdate}
                                position={media.item.id === trailerId ? 0 : this.props.seekTime}
                                key={media.item.mediaUrl || 1}
                                ref={playerUI.setPlayerRef}
                            >
                                {player => {
                                    return (
                                        <div className={playerUI.visible ? null : 'dn' }>
                                            {media.item.stat ? <VideoStatistics media={media.item} currentTime={player.currentTime} playerState={player.state} /> : null}
                                            {media.isLoading || player.state === LOADSTART ? <Loading /> : null}
                                            {item.isPurchased && !media.isLoading && player.state !== LOADSTART ?
                                                <PlayPauseBtn
                                                    media={media}
                                                    getMedia={this.getMedia}
                                                    player={player}
                                                    secondButtonAction={this.getTrailerMedia}
                                                    secondButtonTitle={'Трейлер'}
                                                    showSecondButton={!!trailerId}
                                                    secondMediaWasLoaded={media.item.id === trailerId}
                                                    showToStartBtn={this.props.seekTime > 0}
                                                    onClickToStartBtn={() => this.clickToStartBtn(player)}
                                                /> : null
                                            }
                                            {!item.isPurchased ?
                                                <UpSale
                                                    isPremium={item.isPremium}
                                                    isAmedia={item.isAmedia}
                                                    isIvi={item.isIvi}
                                                    auth={this.props.auth}
                                                    showSignPopup={this.props.showSignPopup}
                                                    subs={item.subs}
                                                    trailerId={trailerId}
                                                    player={player.state === STOPPED ? null : player}
                                                    getTrailerMedia={this.getTrailerMedia}
                                                    history={this.props.history}
                                                /> : null
                                            }
                                            <div className="player-overlay-bottom">
                                                {}
                                                {item.actors ? <Actors actors={item.actors} customClassName={player ? 'raised' : ''}/> : null}
                                                {player.state === STOPPED ? null :
                                                    <div className="player-controls">
                                                        <div className="container rel">
                                                            <Progress currentTime={player.currentTime} duration={player.duration} seek={player.seek} seeking={player.seeking}/>
                                                            <FullScreenButton switchFullscreen={playerUI.switchFullscreen} fullscreenEnabled={playerUI.fullscreenEnabled}/>
                                                            <Volume volume={player.volume} muted={player.muted} setVolume={player.setVolume} mute={player.mute}/>
                                                            <Preferences player={player} playerUI={playerUI}/>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    );
                                }}
                            </Video>
                            <div className={playerUI.visible ? null : 'dn' }>
                                <div className="player-overlay-top">
                                    <h1 className="title" itemProp="name">{item.title}</h1>
                                    <div className="subtitle">
                                        {item.originalTitle ? <span>{item.originalTitle}</span> : null}
                                        {item.country ? <span>{item.country}</span> : null}
                                        {item.year && item.yearEnd && item.yearEnd !== item.year ? <span>{item.year} - {item.yearEnd}</span> : <span>{item.year || item.yearEnd}</span> }
                                        {item.age ? <span>{item.age}+</span> : null}
                                        {item.isHD ? <span><span className="marker-hd"/></span>  : ''}
                                        {this.props.currentSeason ? <span>{this.props.currentSeason.title},</span> : null}
                                        {this.props.currentEpisode ? <span>{this.props.currentEpisode.title}</span> : null}
                                    </div>
                                    <Tags tagsOrder={item.genresIds} tags={item.genres} />
                                </div>
                                {this.props.prevItem ? <SwitchContentButton onClick={this.props.onPrevItemClick} title={this.props.prevItem.title} prev /> : null}
                                {this.props.nextItem ? <SwitchContentButton onClick={this.props.onNextItemClick} title={this.props.nextItem.title} /> : null}
                            </div>
                        </Fragment>
                    );
                }}
            </Player>
        );
    }
}

const mapStateToProps = state => {
    return {
        volumeSettings: state.settings.volumeSettings,
        media: state.media,
        auth: state.auth,
    };
};

export default connect(mapStateToProps, { getMedia, getIviMedia, saveVolumeSettings, clearMedia, showSignPopup, updateVideoPosition })(VodPlayer);
