import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PLAYING, LOADSTART, CANPLAY, ABORT, ERROR, STOPPED } from '../../containers/Video';
import './fullscreenApi';

const defHideTimeout = 2000;
const increasedHideTimeout = 5000;

const canShowPosterPlayerStates = [STOPPED, LOADSTART, CANPLAY, ABORT, ERROR];

export default class Player extends Component {
    static propTypes = {
        children: PropTypes.func.isRequired,
        playerState: PropTypes.string.isRequired,
        freeze: PropTypes.bool,
    };

    state = {
        visible: true,
        error: null,
        hideTimeout: defHideTimeout,
        fullscreenEnabled: false,
    };

    hideTimeout = null;

    increaseHideTimeout = () => {
        if (this.state.hideTimeout !== increasedHideTimeout) {
            this.setState({ hideTimeout: increasedHideTimeout });
        }
    }

    setDefHideTimeout = () => {
        if (this.state.hideTimeout !== defHideTimeout) {
            this.setState({ hideTimeout: defHideTimeout });
        }
    }

    canShowPoster(state) {
        return canShowPosterPlayerStates.indexOf(state) !== -1;
    }

    addKeyoardListener() {
        document.addEventListener('keydown');
    }

    componentDidMount() {
        this.el.focus();
        document.addEventListener('fullscreenchange', this.onFullscreenChange);
    }

    componentDidUpdate() {
        if (this.props.playerState === PLAYING && !this.props.freeze) {
            if (!this.hideTimeout) {
                this.startHideTimeout();
            }
        } else if (!this.visible || this.hideTimeout) {
            this.clearHideTimeout();
            this.show();
        }

        if (this.el.fullscreenEnabled !== this.state.fullscceenEnabled) {
            this.setState({ fullscceenEnabled: this.el.fullscreenEnabled });
        }
    }

    componentWillUnmount() {
        this.clearHideTimeout();
        document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    }

    onFullscreenChange = () => {
        if (document.fullscreenElement && !this.state.fullscreenEnabled) {
            this.setState({ fullscreenEnabled: true });
        } else if (this.state.fullscreenEnabled) {
            this.setState({ fullscreenEnabled: false });
        }
    }

    switchFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            this.el.requestFullscreen();
        }
    };

    hide = () => {
        this.clearHideTimeout();
        this.setState({ visible: false, hideTimeout: defHideTimeout });
    };

    show = () => {
        if (!this.state.visible) {
            this.setState({ visible: true });
        }
    }

    startHideTimeout = () => {
        this.clearHideTimeout();
        this.hideTimeout = setTimeout(this.hide, this.state.hideTimeout);
    }

    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    onClick = e => {
        if (e.target === e.currentTarget) {
            if (this.player) {
                this.player.playPause();
            }
        }
    }

    onKeyPress = e => {
        console.log(e.charCode);
        if (e.charCode === 32) {
            e.preventDefault();
            e.stopPropagation();
            if (this.player) {
                this.player.playPause();
            }
        }
    }

    setPlayerRef = el => {
        this.player = el;
    }

    onMouseLeave = () => {
        if (!this.props.freeze && this.props.playerState === PLAYING && this.state.visible) {
            this.hide();
        }
    }

    render() {
        const visible = this.state.visible;
        return (
            <div className={'player' + (visible ? '' : ' transparent') + (this.state.fullscreenEnabled ? ' fullscreen' : '')} ref={el => this.el = el} tabIndex={0} onKeyPress={this.onKeyPress}>
                <div
                    className="player-overlay"
                    onMouseMove={visible && this.props.playerState === PLAYING ? this.startHideTimeout : this.show}
                    onClick={this.onClick}
                    onMouseLeave={this.onMouseLeave}
                >
                    <div className="container">
                        {
                            this.props.children({
                                hide: this.hide,
                                show: this.show,
                                increaseHideTimeout: this.increaseHideTimeout,
                                setDefHideTimeout: this.setDefHideTimeout,
                                canShowPoster: this.canShowPoster,
                                switchFullscreen: this.switchFullscreen,
                                setPlayerRef: this.setPlayerRef,
                                ...this.state,
                            })}
                    </div>
                </div>
            </div>
        );
    }
}
