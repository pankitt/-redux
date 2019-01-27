import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Video, { STOPPED } from '../../containers/Video';
import { getMedia, getDVRMedia, clearMedia } from '../../actions/media';
import { saveVolumeSettings, saveLastViewedChannel } from '../../actions/settings';
import VideoStatistics from '../../components/VideoStatistics';
import Volume from '../../components/player/Volume';
import PlayPauseBtn from '../../components/player/PlayPauseBtn';
import Loading from '../../components/player/Loading';
import t from '../../i18n';

class RadioPlayer extends Component {
    static propTypes = {
        channel: PropTypes.object.isRequired,
        media: PropTypes.object.isRequired,
        programId: PropTypes.number,
        volumeSettings: PropTypes.object.isRequired,
        saveVolumeSettings: PropTypes.func.isRequired,
        saveLastViewedChannel: PropTypes.func.isRequired,
        getMedia: PropTypes.func.isRequired,
        clearMedia: PropTypes.func.isRequired,
        switchChannel: PropTypes.func.isRequired,
    };

    getMedia = () => {
        if (this.props.media.isLoading) {
            return;
        }

        this.props.getMedia(this.props.channel.id);
    };

    tryStartPlay() {
        if (this.props.channel.isPurchased && !this.props.channel.isUnderParentalProtect) {
            this.getMedia();
        }
    }

    componentDidMount() {
        this.tryStartPlay();
    }

    componentDidUpdate(prevProps) {
        if (this.props.channel.id !== prevProps.channel.id || this.props.programId !== prevProps.programId) {
            this.tryStartPlay();
        }
        // if (!prevProps.media.item.mediaUrl && this.props.media.item.mediaUrl && prevProps.media.item.id === this.props.channel.id) {
        //     this.props.saveLastViewedChannel(this.props.channel.id);
        // }
    }

    componentWillUnmount() {
        const media = this.props.media;
        if (media.item || media.isLoading && media.id === this.props.channel.id) {
            this.props.clearMedia();
        }
    }

    render() {
        const { media } = this.props;
        const poster = this.props.channel.poster;
        return (
            <div className="player">
                <Video
                    src={media.item.mediaUrl}
                    onVolumeChange={this.props.saveVolumeSettings}
                    volume={this.props.volumeSettings.volume}
                    muted={this.props.volumeSettings.muted}
                    key={media.item.mediaUrl || 1}
                >
                    {player => {
                        return (
                            <Fragment>
                                <div className="player-overlay" >
                                    <div className="container">
                                        {!poster ? null :
                                            <Fragment>
                                                <div className="player-poster blur" style={{ backgroundImage: 'url(' + poster + ')' }} />
                                                <img className="player-radio-poster" src={poster} />
                                            </Fragment>
                                        }
                                        {media.item && media.item.mediaUrl ?
                                            <PlayPauseBtn
                                                media={media}
                                                player={player}
                                                secondButtonTitle={t('Back to Live')}
                                                secondButtonAction={this.switchToLive}
                                                getMedia={this.getMedia}
                                                showSecondButton={media.item.id !== this.props.channel.id}
                                            />
                                            : null
                                        }
                                        {media.isLoading ? <Loading/> : null }
                                        {player.state === STOPPED ? null :
                                            <div className="player-overlay-bottom">
                                                <div className="player-controls">
                                                    <div className="container rel">
                                                        <VideoStatistics media={media.item} currentTime={player.currentTime} playerState={player.state} />
                                                        <Volume volume={player.volume} muted={player.muted} setVolume={player.setVolume} mute={player.mute} />
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Fragment>
                        );
                    }}
                </Video>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        volumeSettings: state.settings.volumeSettings,
        media: state.media,
    };
};

export default connect(mapStateToProps, { getMedia, getDVRMedia, saveVolumeSettings, saveLastViewedChannel, clearMedia })(RadioPlayer);
