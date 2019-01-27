import React, { Component } from 'react';
import PropTypes from 'prop-types';
import durationToStr from '../../helpers/durationToStr';
// import { SEEKED } from '../../containers/Video';

class Progress extends Component {
    static propTypes = {
        duration: PropTypes.number.isRequired,
        currentTime: PropTypes.number.isRequired,
        seek: PropTypes.func.isRequired,
        seeking: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            tooltipTitle: '',
            tooltipLeft: 0,
            seekTo: null,
            isMouseDown: false,
            width: 0,
            seeking: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.seeking && props.seeking !== state.seeking && state.seekTo) {
            return { seeking: true };
        }
        if (state.seeking && !props.seeking && state.seekTo) {
            return { seeking: false, seekTo: null };
        }
        return null;
    }

    getBarPosition = (event) => {
        const { width, left } = this.bar.getBoundingClientRect();
        const relX = event.pageX - left;
        if (relX < 0) {
            return;
        }
        let position = relX / width;
        let percentageX = position * 100;
        if (percentageX >= 100) percentageX = 100;
        position = position * this.props.duration;
        return { position: position > this.props.duration ? this.props.duration : position, percentageX };
    }

    _handleMouseMove = e => {
        e.preventDefault();
        const barPosition = this.getBarPosition(e);
        if (barPosition) {
            this.setState({
                tooltipLeft: barPosition.percentageX + '%',
                tooltipTitle: durationToStr(barPosition.position, true),
            });
            if (this.state.isMouseDown) {
                this.setState({
                    seekTo: barPosition.position,
                });
            }
        }
    }

    _handleMouseLeave = () => {
        if (!this.state.isMouseDown) {
            this.setState({ tooltipTitle: '' });
        }
    }

    _handleMouseUp = () => {
        this.setState({
            isMouseDown: false,
        });
        if (this.state.seekTo !== this.props.currentTime) {
            this.props.seek(this.state.seekTo);
        }
    }

    _handleMouseUpDown = (e) => {
        this.removeMouseEvents();
        e.stopPropagation();
        e.preventDefault();

        const barPosition = this.getBarPosition(e);
        if (barPosition) {
            this.setState({
                isMouseDown: false,
                seekTo: barPosition.position,
            });
            if (barPosition.position !== this.props.currentTime) {
                this.props.seek(barPosition.position);
            }
        }
        return false;
    }

    _handleBarMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        document.addEventListener('mousemove', this._handleMouseMove, true);
        document.addEventListener('mouseup', this._handleMouseUpDown, true);
        document.addEventListener('mousedown', this._handleMouseUpDown, true);
        const barPosition = this.getBarPosition(e);
        this.setState({
            isMouseDown: true,
            seekTo: barPosition.position,
        });
    }

    removeMouseEvents() {
        document.removeEventListener('mousemove', this._handleMouseMove, true);
        document.removeEventListener('mouseup', this._handleMouseUpDown, true);
        document.removeEventListener('mousedown', this._handleMouseUpDown, true);
    }

    componentWillUnmount() {
        this.removeMouseEvents();
    }

    render() {
        const { tooltipLeft, tooltipTitle, seekTo } = this.state;
        const progress = (seekTo === null ? this.props.currentTime : seekTo) / this.props.duration * 100;
        return (
            <div className="progress">
                <div className="progress-start">{durationToStr(this.props.currentTime, true)}</div>
                <div className="progress-bar-wrapper"
                    onMouseMove={this.state.isMouseDown ? null : this._handleMouseMove}
                    onMouseLeave={this.state.isMouseDown ? null : this._handleMouseLeave}
                    // onMouseUp={this._handleMouseUp}
                    onMouseDown={this._handleBarMouseDown}
                    // onClick={this._handleBarClick}
                    ref={el => this.bar = el}
                    key="pbw"
                >
                    <div className="progress-bar">
                        <div className="bar" style={{ width: progress + '%' }}>
                            <div className="cursor"/>
                        </div>
                        {tooltipTitle.length ? <div className="tooltip" style={{ left:tooltipLeft }}>{tooltipTitle}</div> : null}
                    </div>
                </div>
                <div className="progress-stop">{durationToStr(this.props.duration, true)}</div>
            </div>
        );
    }
}

export default Progress;
