import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Overlay from '../player/Overlay';
import Progress from '../player/Progress';
import Preferences from '../player/Preferences';
import FullScreenButton from '../player/FullScreenButton';
import Volume from '../player/Volume';
import Poster from '../player/Poster';
import PlayPauseBtn from '../player/PlayPauseBtn';
import { PLAYING, LOADSTART } from '../../containers/Video';
import Loading from '../player/Loading';
import UpSale from '../player/UpSale';
import Tags from '../vod/Tags';

export default class PlayerOverlay extends Overlay {
    static propTypes = {
        id: PropTypes.number,
        title: PropTypes.string,
        age: PropTypes.string,
        originalTitle: PropTypes.string,
        player: PropTypes.object,
        history: PropTypes.object,
        media: PropTypes.object.isRequired,
        getMedia: PropTypes.func.isRequired,
        clearMedia: PropTypes.func.isRequired,
        showSignPopup: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
        genresIds: PropTypes.array,
        genres: PropTypes.object,
    };

    goPayment = id => {
        this.props.history.push('/payment/' + id);
    }

    render() {
        const { title, originalTitle, age, media, getMedia, player } = this.props;
        let onMouseMove;
        if (player) {
            onMouseMove = this.state.visible && player.state === PLAYING ? this.startHideTimeout : this.show;
        }

        return (
            <div className={'player-overlay' + (this.state.visible ? '' : ' transparent')} onMouseMove={onMouseMove} onClick={this.onClick}>
                <div className={'container' + (this.state.visible ? '' : ' dn')}>
                    {player ? null : <Poster itemFrames={this.props.itemFrames}/>}
                    <div className="player-overlay-top">
                        <h1 className="title">{title}</h1>
                        <div className="subtitle">
                            {originalTitle ? <span>{originalTitle}</span> : null}
                            {age ? <span>{age}+</span> : null}
                        </div>
                        <Tags tagsOrder={this.props.genresIds} tags={this.props.genres} />
                    </div>
                    {media.isLoading || player && player.state === LOADSTART ? <Loading/> : null}
                    {this.state.error ? <div className="player-overlay-middle">{JSON.stringify(this.state.error)}</div> : null}
                    {this.props.isPurchased ?
                        <Fragment>
                            <PlayPauseBtn
                                media={media}
                                getMedia={getMedia}
                                player={player}
                            />
                        </Fragment>
                        : <UpSale auth={this.props.auth} showSignPopup={this.props.showSignPopup} subs={this.props.subs} goPayment={this.goPayment}/>
                    }
                    <div className="player-overlay-bottom">
                        {player ?
                            <div className="player-controls">
                                <div className="container rel">
                                    <Progress currentTime={player.currentTime} duration={player.duration} seek={player.seek} seeking={player.seeking}/>
                                    <FullScreenButton switchFullscreen={this.props.player.switchFullscreen} fullscreenEnabled={this.props.player.fullscreenEnabled}/>
                                    <Volume volume={player.volume} muted={player.muted} setVolume={player.setVolume} mute={player.mute} />
                                    <Preferences player={player} isControlsVisible={this.state.visible} increaseHideTimeout={this.increaseHideTimeout} setDefHideTimeout={this.setDefHideTimeout}/>
                                </div>
                            </div> : null}
                    </div>
                </div>
            </div>
        );
    }
}
