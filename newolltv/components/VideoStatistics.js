import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PLAYING, PAUSE, ENDED, ERROR } from '../containers/Video';
import { videoStatViewing, videoStatViewed, videoStatPaused } from '../actions/videoStat';
import { sendContentTime, sendContentWatched } from '../actions/iviService';

class VideoStatistics extends Component {
    static propTypes = {
        currentTime: PropTypes.number,
        duration: PropTypes.number,
        playerState: PropTypes.string,
        media: PropTypes.object,
        sendContentTime: PropTypes.func.isRequired,
        sendContentWatched: PropTypes.func.isRequired,
    };

    lastSendVideoStat = 0;
    viewingDidSent = false;

    componentDidMount() {
        this.lastSendVideoStat = Date.now() - (this.props.media.stat.interval - 5) * 1000; // First time statistics should send after 5 second from start watching
        window.onbeforeunload = () => {
            videoStatViewed(this.props.media.stat, this.props.currentTime);
            if (this.props.media.iviId) {
                this.props.sendContentWatched();
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentTime !== prevProps.currentTime) {
            const now = Date.now();
            if (this.props.media.iviId) {
                this.props.sendContentTime(this.props.currentTime, this.props.duration);
            }
            if (now - this.lastSendVideoStat >= this.props.media.stat.interval * 1000 || (
                this.props.currentTime === 0 && this.props.media === prevProps.media // в случае с перемоткой в начало шлём статистику сразу
            )) {
                this.lastSendVideoStat = now;
                videoStatViewing(this.props.media.stat, this.props.currentTime);
                this.viewingDidSent = true;
            }
        }
        if (this.props.playerState !== prevProps.playerState) {
            switch (this.props.playerState) {
                case ENDED:
                case ERROR:
                    if (prevProps.playerState === PLAYING || prevProps.playerState === PAUSE && this.lastSendVideoStat) {
                        videoStatViewed(this.props.media.stat, this.props.currentTime);
                        this.setState({ lastSendVideoStat: 0 });
                    }
                    break;
                case PAUSE:
                    if (this.viewingDidSent) {
                        videoStatPaused(this.props.media.stat, this.props.currentTime);
                    }
                    break;
            }
        }
    }

    componentWillUnmount() {
        if (this.viewingDidSent) {
            videoStatViewed(this.props.media.stat, this.props.currentTime);
        }
        window.onbeforeunload = null;
    }

    render() {
        return null;
    }
}

export default connect(null, { sendContentTime, sendContentWatched })(VideoStatistics);