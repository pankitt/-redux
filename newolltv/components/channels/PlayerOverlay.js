import React from 'react';
import PropTypes from 'prop-types';
import Overlay from '../player/Overlay';
import Progress from '../player/Progress';
import Preferences from '../player/Preferences';
import FullScreenButton from '../player/FullScreenButton';
import Volume from '../player/Volume';
import PlayPauseBtn from '../player/PlayPauseBtn';
import { PLAYING, LOADSTART } from '../../containers/Video';
import Loading from '../player/Loading';
import t from '../../i18n';
import UpSale from '../player/UpSale';
import SwitchContentButton from '../player/SwitchContentButton';
import ProgramInfo from './ProgramInfo';

export default class PlayerOverlay extends Overlay {
    static propTypes = {
        id: PropTypes.number,
        isPurchased: PropTypes.bool.isRequired,
        poster: PropTypes.string,
        player: PropTypes.object,
        media: PropTypes.object.isRequired,
        switchChannel: PropTypes.func.isRequired,
        showSignPopup: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
        currentProgram: PropTypes.object,
        prevChannel: PropTypes.object,
        nextChannel: PropTypes.object,
    };

    switchToLive = () => {
        this.props.switchChannel(this.props.id);
    }

    goPayment = id => {
        this.props.history.push('/payment/' + id);
    }

    render() {
        const { media, player, currentProgram, prevChannel, nextChannel } = this.props;
        let onMouseMove;
        if (player) {
            onMouseMove = this.state.visible && player.state === PLAYING ? this.startHideTimeout : this.show;
        }
        return (
            <div className={'player-overlay' + (this.state.visible ? '' : ' transparent')} onMouseMove={onMouseMove} onClick={this.onClick}>
                <div className={'container' + (this.state.visible ? '' : ' dn')}>
                    {this.canShowPoster(player) && this.props.poster ? <div className="player-poster blur" style={{ backgroundImage: 'url(' + this.props.poster + ')' }} /> : null}
                    {currentProgram ? <ProgramInfo dvr={currentProgram.dvr} stop={currentProgram.stop} startTime={currentProgram.startTime} isLive={currentProgram.id === this.props.currentProgramId} title={currentProgram.title} /> : null}
                    {!this.props.isPurchased ? <UpSale auth={this.props.auth} showSignPopup={this.props.showSignPopup} goPayment={this.goPayment} subs={this.props.subs} /> : null}
                    {!media.isLoading && this.props.isPurchased ?
                        <PlayPauseBtn
                            media={media}
                            player={player}
                            secondButtonTitle={t('Back to Live')}
                            secondButtonAction={this.switchToLive}
                            getMedia={this.props.getMedia}
                            showSecondButton={media.item.id !== this.props.id}
                        />
                        : null
                    }
                    {prevChannel ? <SwitchContentButton onClick={() => this.props.switchChannel(prevChannel.id)} title={prevChannel.title} prev /> : null}
                    {nextChannel ? <SwitchContentButton onClick={() => this.props.switchChannel(nextChannel.id)} title={nextChannel.title} /> : null}
                    {media.isLoading || player && player.state === LOADSTART ? <Loading/> : null }
                    {player ?
                        <div className="player-overlay-bottom">
                            <div className="player-controls">
                                <div className="container rel">
                                    <Progress currentTime={player.currentTime} duration={player.duration} seek={player.seek} seeking={player.seeking}/>
                                    <FullScreenButton switchFullscreen={this.props.player.switchFullscreen} fullscreenEnabled={this.props.player.fullscreenEnabled}/>
                                    <Volume volume={player.volume} muted={player.muted} setVolume={player.setVolume} mute={player.mute} />
                                    <Preferences player={player} isControlsVisible={this.state.visible} increaseHideTimeout={this.increaseHideTimeout} setDefHideTimeout={this.setDefHideTimeout}/>
                                </div>
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        );
    }
}
