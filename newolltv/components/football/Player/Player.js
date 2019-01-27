import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Player from '../../player/Player';
import Video, { PAUSE } from '../../../containers/Video';
import { getMedia, clearMedia } from '../../../actions/media';
import { saveVolumeSettings } from '../../../actions/settings';
import VideoStatistics from '../../VideoStatistics';
import { showSignPopup } from '../../../actions/sign';
import Progress from '../../player/Progress';
import Preferences from '../../player/Preferences';
import FullScreenButton from '../../player/FullScreenButton';
import Volume from '../../player/Volume';
import PlayPauseBtn from '../../player/PlayPauseBtn';
import { STOPPED } from '../../../containers/Video';
import Timer from './Timer';
import t from '../../../i18n';
import { LIVE_STATUS_ENABLED, LIVE_STATUS_FINISHED, LIVE_STATUS_STOPPED } from '../../../constants';
import UpSale from '../../player/UpSale';


class FootballPlayer extends Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        media: PropTypes.object.isRequired,
        auth: PropTypes.object.isRequired,
        mediaId: PropTypes.number,
        highlightId: PropTypes.number,
        highlight: PropTypes.object,
        history: PropTypes.object,
        volumeSettings: PropTypes.object.isRequired,
        saveVolumeSettings: PropTypes.func.isRequired,
        getMedia: PropTypes.func.isRequired,
        clearMedia: PropTypes.func.isRequired,
        switchToLive: PropTypes.func.isRequired,
        showSignPopup: PropTypes.func.isRequired,
    };

    state = {
        playerState: STOPPED,
    };

    onStateChange = playerState => {
        if (this.state.playerState !== playerState) {
            this.setState({ playerState });
        }
    };

    getMedia = () => {
        const { highlightId, media, match, getMedia } = this.props;
        if (media.isLoading) {
            return;
        }
        if (highlightId) {
            getMedia(highlightId);
        } else if (match.liveId) {
            getMedia(match.liveId);
        }
    };

    componentDidMount() {
        this.getMedia();
    }

    componentDidUpdate(prevProps) {
        const { highlightId, match } = this.props;
        if ((highlightId && highlightId !== prevProps.highlightId) || (prevProps.highlightId && !highlightId && match.liveId) || (match.liveId && match.liveId !== prevProps.match.liveId)) {
            this.getMedia();
        }
    }

    componentWillUnmount() {
        if (this.props.media.item) {
            this.props.clearMedia();
        }
    }
    // getPlayerOverlay(player) {
    //     return <PlayerOverlay
    //         match={this.props.match}
    //         highlight={this.props.highlight}
    //         player={player}
    //         media={this.props.media}
    //         getMedia={this.getMedia}
    //         clearMedia={this.props.clearMedia}
    //         switchToLive={this.props.switchToLive}
    //         auth={this.props.auth}
    //         history={this.props.history}
    //         showSignPopup={this.props.showSignPopup}
    //         key="ov"
    //     />;
    // }
    render() {
        const { media, match, highlight } = this.props;
        let highlightOrMatch = highlight || match,
            switchToLive = highlight ? this.props.switchToLive : this.getMedia;
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
                                let mainPart = null;
                                if (match.liveStatus === LIVE_STATUS_STOPPED) {
                                    mainPart = <Timer startTime={match.webStartTS} cover={match.tournamentPlayerImage} key={match.id}/>;
                                } else if (match.liveStatus === LIVE_STATUS_FINISHED && !highlight) {
                                    mainPart = <div className="counter" style={{ backgroundImage: 'url(' + match.tournamentPlayerImage + ')' }}/>;
                                } else {
                                    mainPart = <PlayPauseBtn
                                        media={media}
                                        player={player}
                                        showSecondButton={(highlight && match.liveStatus === LIVE_STATUS_ENABLED) || (!highlight && player.state === PAUSE)}
                                        secondButtonTitle={t('Back to Live')}
                                        secondButtonAction={switchToLive}
                                        getMedia={this.props.getMedia}
                                    />;
                                }
                                return (
                                    <div className={playerUI.visible ? null : 'dn'}>
                                        {highlightOrMatch.isPurchased ?
                                            <Fragment>
                                                {highlight ?
                                                    <div className="player-overlay-top highlight-title">
                                                        <div className={ 'marker-football ' + highlight.marker }>{ highlight.marker && t(highlight.marker) }</div>
                                                        <span>{highlight.title}</span>
                                                    </div>
                                                    : null
                                                }
                                                {mainPart}
                                            </Fragment>
                                            :
                                            <Fragment>
                                                {match.tournamentPlayerImage ? <div className="player-poster blur" style={{ backgroundImage: 'url(' + match.tournamentPlayerImage + ')' }}/> : null}
                                                <UpSale auth={this.props.auth} showSignPopup={this.props.showSignPopup} subs={highlightOrMatch.subs} isFootball goPayment={this.goPayment} history={this.props.history}/>
                                            </Fragment>
                                        }
                                        {player.state === STOPPED ? null :
                                            <div className="player-overlay-bottom">
                                                <div className="player-controls">
                                                    <div className="container rel">
                                                        <VideoStatistics media={media.item} currentTime={player.currentTime} playerState={player.state} />
                                                        <Progress currentTime={player.currentTime} duration={player.duration} seek={player.seek} seeking={player.seeking}/>
                                                        <FullScreenButton switchFullscreen={playerUI.switchFullscreen} fullscreenEnabled={playerUI.fullscreenEnabled}/>
                                                        <Volume volume={player.volume} muted={player.muted} setVolume={player.setVolume} mute={player.mute} />
                                                        <Preferences player={player} playerUI={playerUI}/>
                                                    </div>
                                                </div>
                                            </div>
                                        }
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

const mapStateToProps = (state, ownProps) => {
    let highlight = null;
    if (ownProps.highlightId) {
        highlight = state.football.highlights[ownProps.highlightId];
    }
    return {
        volumeSettings: state.settings.volumeSettings,
        media: state.media,
        auth: state.auth,
        highlight,
    };
};

export default connect(mapStateToProps, { getMedia, saveVolumeSettings, clearMedia, showSignPopup })(FootballPlayer);
