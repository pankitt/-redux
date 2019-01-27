import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Volume extends Component {
    static propTypes = {
        volume: PropTypes.number.isRequired,
        muted: PropTypes.bool.isRequired,
        setVolume: PropTypes.func.isRequired,
        mute: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            positionInPercents: props.volume * 100,
            isMute: false,
            isMouseDown: false,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.muted !== state.muted || props.volume !== state.volume) {
            return { muted: props.muted, volume: props.volume, positionInPercents: props.volume * 100 };
        }
        return null;
    }

    _handleIconMouseEnter = () => {
        this.setState({ isOpen: true });
    }

    _handleIconMouseLeave = () => {
        this.setState({ isOpen: false });
    }

    _setBarPosition = (event) => {
        const { height, top } = this.bar.getBoundingClientRect();

        const relY = event.pageY - 10 - top;

        let percentageY = Math.round((relY / (height - 20)) * 100);

        if (percentageY >= 96) {
            percentageY = 100;
        } else if (percentageY <= 4) {
            percentageY = 0;
        }
        const volume = 100 - percentageY;
        this.props.setVolume(volume / 100);
        return volume;
    }

    _handleMouseMove = (event) => {
        // console.log('_handleMouseMove', event);
        if (this.state.isMouseDown) {
            this.setState({
                positionInPercents: this._setBarPosition(event),
                isMute: this._setBarPosition(event) === 0,
            });
        }
    }

    _handleMouseUpDown = (e) => {
        this.removeMouseEvents();
        e.stopPropagation();
        e.preventDefault();

        const bar = this.bar.getBoundingClientRect();
        const button = this.button.getBoundingClientRect();
        // console.log(bar, button, e);
        let isOpen = this.state.isOpen;
        if (e.clientX < bar.left || e.clientX > bar.left + bar.width || e.clientY < bar.top || e.clientY > button.top + button.height) {
            isOpen = false;
        }
        this.setState({ isMouseDown: false, isOpen });
        return false;
    }

    _handleBarMouseDown = (event) => {
        // console.log('_handleBarMouseDown');
        document.addEventListener('mousemove', this._handleMouseMove, true);
        document.addEventListener('mouseup', this._handleMouseUpDown, true);
        document.addEventListener('mousedown', this._handleMouseUpDown, true);
        this.setState({
            isMouseDown: true,
            positionInPercents: this._setBarPosition(event),
        });
    }

    mute = () => {
        if (this.props.volume) {
            this.props.mute();
        } else {
            this.props.setVolume(0.5);
        }
    };

    removeMouseEvents() {
        document.removeEventListener('mousemove', this._handleMouseMove, true);
        document.removeEventListener('mouseup', this._handleMouseUpDown, true);
        document.removeEventListener('mousedown', this._handleMouseUpDown, true);
    }

    componentWillUnmount() {
        this.removeMouseEvents();
    }


    render() {
        const { isOpen, isMouseDown, positionInPercents } = this.state;

        const muteClassName = this.props.muted || !this.props.volume  ? 'mute' : '';

        const value = this.props.muted ? 0 : positionInPercents;

        return (
            <div
                className="volume-block"
                onMouseEnter={isMouseDown ? null : this._handleIconMouseEnter}
                onMouseLeave={isMouseDown ? null : this._handleIconMouseLeave}
                onKeyDown={this.onKeyDown}
            >
                {isOpen ? <div className="volume-wrapper" onMouseDown={this._handleBarMouseDown} ref={el => this.bar = el} key="vp">
                    <div className="volume-bar">
                        <div className="gradient" style={{ height: value + '%' }}/>
                        <div className="value">{Math.round(value)}</div>
                    </div>
                </div> : null}
                <div onClick={this.mute} className={'btn-icon volume-btn ' + muteClassName} ref={el => this.button = el} key="vb"/>
            </div>
        );
    }
}
