import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import t from '../../i18n';

export default class Preferences extends Component {
    static propTypes = {
        // item: PropTypes.object,
        player: PropTypes.object.isRequired,
        playerUI: PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            activeTab: 'levels',
            activeTabNumber: 0,
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (!props.playerUI.visible && state.isOpen) {
            return { isOpen: false };
        }
        return null;
    }
    componentWillUnmount() {
        if (this.state.isOpen) {
            document.removeEventListener('click', this.catchOutsideClick, true);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.isOpen && this.state.isOpen) {
            document.addEventListener('click', this.catchOutsideClick, true);
        }
        if (prevState.isOpen && !this.state.isOpen) {
            document.removeEventListener('click', this.catchOutsideClick, true);
        }
    }

    catchOutsideClick = e => {
        if (!this.el.contains(e.target)) {
            this._handleIconClick();
        }
    }

    audioTracks() {
        const currentTrack = this.props.player.audioTrack;
        const switchAudioTrack = this.props.player.switchAudioTrack;
        return map(this.props.player.audioTracks, track => <div className={currentTrack === track.id ? 'item current' : 'item'} key={track.id} onClick={currentTrack === track.id ? null : () => switchAudioTrack(track.id) }>{track.name}</div>);
    }

    subtitles() {
        const currentTrack = this.props.player.audioTrack;
        const switchAudioTrack = this.props.player.switchAudioTrack;
        return map(this.props.player.audioTracks, track => <div className={currentTrack === track.id ? 'item current' : 'item'} key={track.id} onClick={currentTrack === track.id ? null : () => switchAudioTrack(track.id) }>{track.name}</div>);
    }

    levels() {
        const currentLevel = this.props.player.autoLevelEnabled ? -1 : this.props.player.currentLevel;
        const switchLevel = this.props.player.switchLevel;
        if (this.props.player.levels.length < 2) {
            return null;
        }

        const availableLevels = this.props.player.levels;

        const levels = [];

        const highLevelIndex = availableLevels.length - 1;
        // const highLevel = availableLevels[highLevelIndex];


        levels.push(<div className={currentLevel === highLevelIndex ? 'item current' : 'item'} onClick={currentLevel === highLevelIndex ? null : () => switchLevel(highLevelIndex)} key="h">{t('High')}</div>);
        if (availableLevels.length > 2) {
            const middleLevelIndex = Math.ceil((availableLevels.length - 1)  / 2);
            // const middleLevel = availableLevels[middleLevelIndex];
            levels.push(<div className={currentLevel === middleLevelIndex ? 'item current' : 'item'} onClick={currentLevel === middleLevelIndex ? null : () => switchLevel(middleLevelIndex)} key="m">{t('Medium')}</div>);
        }
        // const optimalLevel = availableLevels[0];
        levels.push(<div className={currentLevel === 0 ? 'item current' : 'item'} onClick={currentLevel === 0 ? null : () => switchLevel(0)} key="l">{t('Optimal')}</div>);

        // map(this.props.player.levels, (level, i) => <div className={currentLevel === i ? 'item current' : 'item'} key={level.bitrate} onClick={currentLevel === i ? null : () => switchLevel(i)}>{level.bitrate}</div>).reverse();
        levels.push(<div className={currentLevel === -1 ? 'item current' : 'item'} onClick={currentLevel === -1 ? null : () => switchLevel(-1)} key="a">{t('Auto')}</div>);
        return levels;
    }

    _setActiveTab = (activeTab) => {
        this.setState({ activeTab });
    }

    _handleIconClick = () => {
        if (this.state.isOpen) {
            this.props.playerUI.setDefHideTimeout();
        } else {
            this.props.playerUI.increaseHideTimeout();
        }
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        const { isOpen, activeTab } = this.state;
        const iconIsOpenClassName = isOpen ? 'active' : '';

        const tabs = [];
        let activeIndex = 0;

        if (this.props.player.levels.length > 1) {
            tabs.push({ id: 'levels', title: t('Levels') });
        }
        // if (this.props.player) {
        //     tabs.push('subtitles');
        // }
        if (this.props.player.audioTracks.length) {
            if (activeTab === 'audioTracks') {
                activeIndex = tabs.length;
            }
            tabs.push({ id: 'audioTracks', title: t('Audio') });
        }

        if (!tabs.length) {
            return null;
        }

        const transform = { transform: 'translateX(' + (-250 *  activeIndex + 'px)') };
        return (
            <div className="preferences" ref={el => this.el = el}>
                {isOpen ? <div className="preferences-popup">
                    <div className="preferences-popup-head">
                        {map(tabs, (tab, key) => {
                            const activeCN = (tab.id === activeTab && tabs.length > 1) ? 'active' : '';
                            return (
                                <div className={'tab ' + activeCN} onClick={() => this._setActiveTab(tab.id)} key={key}>{tab.title}</div>
                            );
                        })}
                    </div>
                    <div className="preferences-popup-body">
                        <div className="preferences-popup-body-items" style={transform}>
                            {map(tabs, (tab, key) => {
                                return <div className="preferences-popup-body-item" key={key}>
                                    {this[tab.id]()}
                                </div>;
                            })}
                        </div>

                    </div>
                </div> : null}
                <div onClick={this._handleIconClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 50 50" fill="white" version="1.1"
                        className={'preferences-icon btn-icon ' + iconIsOpenClassName}
                    >
                        <rect className="preferences-icon_rect1" x="10" y="16" width="4" height="2" rx="1"/>
                        <rect className="preferences-icon_rect2" x="24" y="16" width="16" height="2" rx="1"/>
                        <rect className="preferences-icon_rect3" x="10" y="24" width="14" height="2" rx="1"/>
                        <rect className="preferences-icon_rect4" x="34" y="24" width="6" height="2" rx="1"/>
                        <circle className="preferences-icon_oval1" cx="19" cy="17" r="3"/>
                        <circle className="preferences-icon_oval2" cx="29" cy="25" r="3"/>
                        <circle className="preferences-icon_oval1" cx="19" cy="33" r="3"/>
                        <rect className="preferences-icon_rect1" x="10" y="32" width="4" height="2" rx="1"/>
                        <rect className="preferences-icon_rect2" x="24" y="32" width="16" height="2" rx="1"/>
                    </svg>
                </div>

            </div>
        );
    }
}
