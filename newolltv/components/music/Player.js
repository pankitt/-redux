import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Player from '../player/Player';
import Video, { STOPPED, LOADSTART } from '../../containers/Video';
import { getMedia, clearMedia } from '../../actions/media';
import { getIviMedia } from '../../actions/iviService';
import { saveVolumeSettings } from '../../actions/settings';
import VideoStatistics from '../VideoStatistics';
import { showSignPopup } from '../../actions/sign';
import Progress from '../player/Progress';
import Preferences from '../player/Preferences';
import FullScreenButton from '../player/FullScreenButton';
import Volume from '../player/Volume';
import Poster from '../player/Poster';
import PlayPauseBtn from '../player/PlayPauseBtn';
import Loading from '../player/Loading';
import UpSale from '../player/UpSale';
import Tags from '../vod/Tags';

class MusicPlayer extends Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        media: PropTypes.object.isRequired,
        mediaId: PropTypes.number.isRequired,
        volumeSettings: PropTypes.object.isRequired,
        saveVolumeSettings: PropTypes.func.isRequired,
        getMedia: PropTypes.func.isRequired,
        getIviMedia: PropTypes.func.isRequired,
        clearMedia: PropTypes.func.isRequired,
        currentSeason: PropTypes.object,
        history: PropTypes.object,
        currentEpisode: PropTypes.object,
        prevItem: PropTypes.object,
        onPrevItemClick: PropTypes.func,
        nextItem: PropTypes.object,
        onNextItemClick: PropTypes.func,
        showSignPopup: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    };

    getMedia = () => {
        if (this.props.media.isLoading) {
            return;
        }
        this.props.getMedia(this.props.mediaId);
    };

    state = {
        playerState: STOPPED,
    };

    onStateChange = playerState => {
        if (this.state.playerState !== playerState) {
            this.setState({ playerState });
        }
    }

    componentWillUnmount() {
        const media = this.props.media;
        if (media.item || (media.isLoading && media.id === this.props.mediaId)) {
            this.props.clearMedia();
        }
    }

    componentDidMount() {
        if (this.props.mediaId && this.props.item && this.props.item.isPurchased) {
            this.getMedia();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item && !this.props.media.id) {
            this.getMedia();
        }
    }

    render() {
        const { media, item } = this.props;

        return (
            <Player playerState={this.state.playerState}>
                {playerUI => {
                    return (
                        <Video
                            src={media.item.mediaUrl}
                            onVolumeChange={this.props.saveVolumeSettings}
                            volume={this.props.volumeSettings.volume}
                            muted={this.props.volumeSettings.muted}
                            onStateChange={this.onStateChange}
                            key={media.item.mediaUrl || 1}
                            ref={playerUI.setPlayerRef}
                        >
                            {player => {
                                return (
                                    <div className={playerUI.visible ? null : 'dn'}>
                                        {player ? null : <Poster itemFrames={item.itemFrames}/>}
                                        <div className="player-overlay-top">
                                            <h1 className="title">{item.title}</h1>
                                            <div className="subtitle">
                                                {item.originalTitle ? <span>{item.originalTitle}</span> : null}
                                                {item.age ? <span>{item.age}+</span> : null}
                                            </div>
                                            <Tags tagsOrder={item.genresIds} tags={item.genres} />
                                        </div>
                                        {media.isLoading || player && player.state === LOADSTART ? <Loading/> : null}
                                        {this.state.error ? <div className="player-overlay-middle">{JSON.stringify(this.state.error)}</div> : null}
                                        {item.isPurchased ?
                                            <Fragment>
                                                <PlayPauseBtn
                                                    media={media}
                                                    getMedia={this.getMedia}
                                                    player={player}
                                                />
                                            </Fragment>
                                            : <UpSale auth={this.props.auth} showSignPopup={this.props.showSignPopup} subs={item.subs} goPayment={this.goPayment} history={this.props.history}/>
                                        }
                                        <div className="player-overlay-bottom">
                                            {player.state === STOPPED ? null :
                                                <div className="player-controls">
                                                    <div className="container rel">
                                                        <VideoStatistics media={media.item} currentTime={player.currentTime} playerState={player.state} />
                                                        <Progress currentTime={player.currentTime} duration={player.duration} seek={player.seek} seeking={player.seeking}/>
                                                        <FullScreenButton switchFullscreen={playerUI.switchFullscreen} fullscreenEnabled={playerUI.switchFullscreen}/>
                                                        <Volume volume={player.volume} muted={player.muted} setVolume={player.setVolume} mute={player.mute} />
                                                        <Preferences player={player} playerUI={playerUI}/>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                );
                            }}
                        </Video>
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

export default connect(mapStateToProps, { getMedia, getIviMedia, saveVolumeSettings, clearMedia, showSignPopup })(MusicPlayer);
