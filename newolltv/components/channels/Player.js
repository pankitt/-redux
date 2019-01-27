import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Video, { ENDED, STOPPED } from '../../containers/Video';
import { getMedia, getDVRMedia, clearMedia } from '../../actions/media';
import { saveVolumeSettings, saveLastViewedChannel } from '../../actions/settings';
import { showSignPopup } from '../../actions/sign';

import Player from '../player/Player';
import UpSale from '../player/UpSale';
import { getChannelEpg } from '../../actions/channels';
import ChannelsPlayerMenu from './ChannelsPlayerMenu';
import ChannelsPlayerControls from './ChannelsPlayerControls';

class ChannelPlayer extends Component {
    static propTypes = {
        currentChannel: PropTypes.object.isRequired,
        history: PropTypes.object,
        media: PropTypes.object.isRequired,
        programId: PropTypes.number,
        volumeSettings: PropTypes.object.isRequired,
        saveVolumeSettings: PropTypes.func.isRequired,
        saveLastViewedChannel: PropTypes.func.isRequired,
        getMedia: PropTypes.func.isRequired,
        getDVRMedia: PropTypes.func.isRequired,
        clearMedia: PropTypes.func.isRequired,
        switchChannel: PropTypes.func.isRequired,
        playNextDvrOrLive: PropTypes.func.isRequired,
        showSignPopup: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
    };

    state = {
        showLeftSideBar: false,
        showRightSideBar: false,
        playerState: STOPPED,
    };

    static getDerivedStateFromProps(props, state) {
        if (!props.media.item.mediaUrl && state.playerState !== STOPPED) {
            return { playerState: STOPPED };
        }
        return null;
    }

    showLeftSideBar = () => {
        this.setState({ showLeftSideBar: true });
        document.body.style.overflow = 'hidden';
    };

    showRightSideBar = () => {
        this.setState({ showRightSideBar: true });
        document.body.style.overflow = 'hidden';
    };

    hideSideBar = () => {
        this.setState({ showLeftSideBar: false, showRightSideBar: false });
        document.body.style.overflow = 'auto';
    };

    getMedia = (id) => {
        const mediaId = id || this.props.currentChannel.id;

        if (this.props.media.id === mediaId && this.props.media.isLoading) {
            return;
        }

        this.props.getMedia(mediaId);
    };

    getDvrMedia = () => {
        if (this.props.media.id === this.props.programId && this.props.media.isLoading) {
            return;
        }
        if (!this.props.currentChannel.isOwn) {
            this.props.getDVRMedia(this.props.programId);
        } else {
            this.getMedia(this.props.programId);
        }
    };

    playLive = () => {
        if (this.props.programId) {
            this.props.switchChannel(this.props.currentChannel.id);
        } else {
            this.getMedia();
        }
    }

    tryStartPlay() {
        const currentChannel = this.props.currentChannel;
        if (currentChannel.isPurchased && !currentChannel.isUnderParentalProtect) {
            if (this.props.programId) {
                this.getDvrMedia();
            } else {
                this.getMedia();
            }
        }
    }

    onStateChange = state => {
        if (this.state.playerState !== state) {
            this.setState({ playerState: state });
        }
        if (state === ENDED && this.props.programId) {
            this.props.playNextDvrOrLive();
        }
    };

    componentDidMount() {
        this.tryStartPlay();
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentChannel.id !== prevProps.currentChannel.id || this.props.programId !== prevProps.programId) {
            this.tryStartPlay();
        }
        if (!prevProps.media.item.mediaUrl && this.props.media.item.mediaUrl && this.props.media.item.id === this.props.currentChannel.id) {
            this.props.saveLastViewedChannel(this.props.currentChannel.id);
        }
    }

    componentWillUnmount() {
        const media = this.props.media;
        if (media.item || media.isLoading && (media.id === this.props.currentChannel.id || media.id === this.props.programId)) {
            this.props.clearMedia();
        }
    }

    render() {
        const { media, currentChannel, auth } = this.props;
        return (
            <Player playerState={this.state.playerState} freeze={this.state.showLeftSideBar || this.state.showRightSideBar} >
                {(playerUI) => {
                    return (
                        <Fragment>
                            {!currentChannel.isPurchased ?
                                <UpSale
                                    auth={auth}
                                    showSignPopup={this.props.showSignPopup}
                                    history={this.props.history}
                                    subs={currentChannel.subs}
                                /> :
                                <Video
                                    src={media.item.mediaUrl}
                                    onVolumeChange={this.props.saveVolumeSettings}
                                    volume={this.props.volumeSettings.volume}
                                    muted={this.props.volumeSettings.muted}
                                    onStateChange={this.onStateChange}
                                    key={media.item.mediaUrl || 1}
                                    ref={playerUI.setPlayerRef}
                                >
                                    { video => <ChannelsPlayerControls
                                        video={video}
                                        playerUI={playerUI}
                                        media={media}
                                        item={currentChannel}
                                        getMedia={this.getMedia}
                                        poster={playerUI.canShowPoster(video.state) && currentChannel.poster ? currentChannel.poster : ''}
                                        switchToLive={this.playLive}
                                    />}
                                </Video>
                            }
                            <ChannelsPlayerMenu
                                showLeftSideBar={this.showLeftSideBar}
                                showRightSideBar={this.showRightSideBar}
                                hideSideBar={this.hideSideBar}
                                showedLeftSideBar={this.state.showLeftSideBar}
                                showedRightSideBar={this.state.showRightSideBar}
                                fullscreenEnabled={playerUI.fullscreenEnabled}
                                visible={playerUI.visible}
                            />
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
    };
};

export default connect(mapStateToProps, { getMedia, getDVRMedia, saveVolumeSettings, saveLastViewedChannel, clearMedia, showSignPopup, getChannelEpg })(ChannelPlayer);
