import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Hls from 'hls.js';

export const STOPPED = 'stopped';
export const LOADSTART = 'loadstart';
export const CANPLAY = 'canplay';
export const PLAYING = 'playing';
export const PAUSE = 'pause';
export const TIMEUPDATE = 'timeupdate';
export const ENDED = 'ended';
export const ABORT = 'abort';
export const ERROR = 'error';
export const SEEKED = 'seeked';
export const SEEKING = 'seeking';

const VOLUMECHANGE = 'volumechange';

const events = [
    'loadstart',
    // 'progress',
    // 'suspend',
    'abort',
    'error',
    // 'emptied',
    // 'stalled',
    'loadedmetadata',
    'loadeddata',
    'canplay',
    // 'canplaythrough',
    'playing',
    'waiting',
    'seeking',
    'seeked',
    'ended',
    'durationchange',
    'timeupdate',
    // 'play',
    'pause',
    // 'ratechange',
    'resize',
    'volumechange',
];

// play
// waiting
// loadstart
// progress
// suspend
// durationchange
// resize
// loadedmetadata
// loadeddata
// canplay
// playing
// canplaythrough
// timeupdate
// ...

export default class Video extends Component {
    static propTypes = {
        src: PropTypes.string,
        onStateChange: PropTypes.func,
        onTimeUpdate: PropTypes.func,
        onVolumeChange: PropTypes.func,
        style: PropTypes.object,
        poster: PropTypes.object,
        position: PropTypes.number,
        children: PropTypes.func,
        autoPlay: PropTypes.bool,
        volume: PropTypes.number,
        muted: PropTypes.bool,
        seekTime: PropTypes.number,
    };

    static defaultProps = {
        style: {
            backgroundColor: '#000',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -10,
        },
        autoPlay: true,
        position: 0,
        volume: 1,
    };

    constructor(props) {
        super(props);

        this.state = {
            state: STOPPED,
            audioTracks: [],
            audioTrack: -1,
            levels: [],
            currentLevel: null,
            autoLevelEnabled: true,
            volume: this.props.volume,
            muted: this.props.muted,
            // fullscreenEnabled: false,
            error: null,
            seeking: false,
        };

        this.hls = null;
    }

    mediaEventsCapture = event => {
        // console.log('event.type', event.type);
        switch (event.type) {
            case LOADSTART:
            case PLAYING:
            case PAUSE:
            // case SEEKED:
                this.onStateChange(event.type);
                break;
            case CANPLAY:
                if (this.video.paused) {
                    if (this.state.state !== PAUSE) {
                        this.onStateChange(PAUSE);
                    }
                } else if (this.state.state !== PLAYING) {
                    this.onStateChange(PLAYING);
                }
                break;
            case SEEKING:
                this.setState({ seeking: true });
                break;
            case SEEKED:
                this.setState({ seeking: false });
                break;
            case TIMEUPDATE:
                this.onTimeUpdate();
                break;
            case VOLUMECHANGE:
                this.setState({ volume: this.video.volume, muted: this.video.muted });
                if (this.props.onVolumeChange) {
                    this.props.onVolumeChange(this.video.volume, this.video.muted);
                }
                break;
            case ENDED:
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                this.onStateChange(event.type);
        }
    }

    onStateChange(state) {
        if (this.props.onStateChange) {
            const { state: prevState, currentTime, duration } = this.state;
            this.props.onStateChange(state, prevState, currentTime, duration);
        }
        this.setState({ state });
    }

    onTimeUpdate() {
        const currentTime = Math.floor(this.video.currentTime),
            duration = Math.floor(this.video.duration);
        if (currentTime !== this.state.currentTime || duration !== this.state.duration) {
            this.setState({ currentTime, duration });
            if (this.props.onTimeUpdate) {
                this.props.onTimeUpdate(currentTime, duration);
            }
        }
    }

    playPause = () => {
        switch (this.state.state) {
            case PLAYING:
                this.video.pause();
                break;
            case PAUSE:
                this.video.play();
                break;
            case CANPLAY:
                if (this.video.paused) {
                    this.video.play();
                } else {
                    this.video.pause();
                }
                break;
            case ENDED:
                this.seek(0);
                this.video.play();
        }
    }

    seek = position => {
        this.video.currentTime = position;
    }

    switchAudioTrack = id => {
        if (this.state.audioTracks.length && this.state.audioTracks[id]) {
            this.hls.audioTrack = id;
        }
    }

    switchLevel = level => {
        if (level === -1 || level >= this.state.levels.length || level < -1) {
            if (!this.hls.autoLevelEnabled) {
                this.hls.currentLevel = -1;
                this.setState({ autoLevelEnabled:  true });
            }
        } else {
            if (this.hls.autoLevelEnabled && this.hls.currentLevel === level) {
                this.setState({ currentLevel: level, autoLevelEnabled: false });
            }
            this.hls.currentLevel = level;
        }
    }

    setVolume = (volume) => {
        this.video.volume = volume;
        this.video.muted = false;
    }

    mute = mute => {
        this.video.muted = typeof mute !== 'undefined' ? mute : !this.video.muted;
    }

    initHslJs() {
        const hls = new Hls({
            // debug: process.env.NODE_ENV !== 'production',
            startPosition: this.props.position || -1,
        });
        hls.attachMedia(this.video);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log('video and hls.js are now bound together !');
            hls.loadSource(this.props.src);
            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                console.log('manifest loaded, found ' + data.levels.length + ' quality level');
                this.setState({ levels: data.levels });
                if (this.props.autoPlay) {
                    this.video.onloadedmetadata = () => {
                        this.video.play();
                        this.video.onloadedmetadata = null;
                    };
                    // this.video.play().catch(
                    //     console.error
                    // );
                }
            });
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        // try to recover network error
                        console.log('fatal network error encountered, try to recover');
                        if (data.networkDetails.status === 200) {
                            // hls.startLoad();
                            return;
                        }
                        // if (data.networkDetails.status === 403) {
                        this.setState({ state: ERROR, error: { message: 'network error', code: data.networkDetails.status } });
                        // }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log('fatal media error encountered, try to recover');
                        hls.recoverMediaError();
                        break;
                    default:
                        // cannot recover
                        hls.destroy();
                        this.setState({ state: ERROR });
                        break;
                }
            }
        });
        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
            console.log(event, data);
            this.setState({ audioTracks: data.audioTracks });
        });
        hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
            console.log(event, data);
            this.setState({ audioTrack: data.id });
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            // console.log(event, data);
            this.setState({ currentLevel: data.level, autoLevelEnabled: hls.autoLevelEnabled });
        });
        this.hls = hls;
        window.hlsInst = hls;
    }

    init() {
        this.video.volume = this.state.volume;
        this.video.muted = this.state.muted;
        if (Hls.isSupported()) {
            this.initHslJs();
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!application/vnd.apple.mpegurl');
            this.video.src = this.props.src;
            this.video.currentTime = this.props.position;
            this.video.addEventListener('loadedmetadata', () => {
                this.onStateChange(CANPLAY);
                if (this.props.autoPlay) {
                    this.video.play().catch(console.error);
                }
            });
        } else {
            this.onStateChange(ERROR);
            return;
        }
        for (let i = 0; i < events.length; i++) {
            this.video.addEventListener(events[i], this.mediaEventsCapture, true);
        }
        if (this.props.seekTime) {
            this.seek(this.props.seekTime);
        }

        // if (this.el.fullscreenEnabled !== this.state.fullscceenEnabled) {
        //     this.setState({ fullscceenEnabled: this.el.fullscreenEnabled });
        // }
    }

    componentDidMount() {
        if (this.props.src) {
            this.init();
        }
        // document.addEventListener('fullscreenchange', this.onFullscreenChange);
    }

    componentWillUnmount() {
        console.log('Video unmount');
        for (let i = 0; i < events.length; i++) {
            this.video.removeEventListener(events[i], this.mediaEventsCapture, true);
        }
        if (this.hls) {
            this.hls.destroy();
        }
        // document.removeEventListener('fullscreenchange', this.onFullscreenChange);
    }

    render() {
        return (
            <div>
                <video
                    style={this.props.style}
                    ref={el => this.video = el}
                    // autoPlay={this.props.autoPlay}
                    key={this.props.src || 'v'}
                    poster={this.props.poster}
                    onClick={this.playPause}
                />
                {typeof this.props.children === 'function' ? this.props.children({
                    playPause: this.playPause,
                    seek: this.seek,
                    switchAudioTrack: this.switchAudioTrack,
                    switchLevel: this.switchLevel,
                    setVolume: this.setVolume,
                    mute: this.mute,
                    switchFullscreen: this.switchFullscreen,
                    ...this.state,
                }) : null}
            </div>
        );
    }
}

// function isIos() {
//     let vendor = navigator.vendor,
//         userAgent = navigator.userAgent;
//
//     return vendor && vendor.indexOf('Apple') > -1 && userAgent && /iphone|ipod|ipad/i.test(userAgent);
// }