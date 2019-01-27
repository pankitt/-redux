import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import SideBar from '../sidebar/SideBar';
import Carousel from '../carousel/Carousel';
import map from 'lodash/map';
import ChannelEPG from './ChannelEPG';
import moment from 'moment';
import t from '../../i18n';


class ChannelEPGSidebar extends Component {
    static propTypes = {
        currentChannel: PropTypes.object,
        onClose: PropTypes.func,
        getChannelEpg: PropTypes.func.isRequired,
        switchToDvr: PropTypes.func.isRequired,
        switchChannel: PropTypes.func.isRequired,
        activeProgramId: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {};
        this.epgList = createRef();
    }

    static getDerivedStateFromProps(props, state) {
        if (state.currentChannel !== props.currentChannel) {
            const activeProgramTab = props.activeProgramId && props.currentChannel && props.currentChannel.epg && props.currentChannel.epg[props.activeProgramId] ? moment(props.currentChannel.epg[props.activeProgramId].startDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

            const activeTab = state.currentChannel && state.currentChannel.id === props.currentChannel.id ? state.activeTab : activeProgramTab;

            return {
                calendar: createCalendar(),
                activeTab,
                epg: props.currentChannel.epgByDate && props.currentChannel.epgByDate[activeTab],
                currentChannel: props.currentChannel,
            };
        }
        return null;
    }

    handleClose = () => {
        this.props.onClose();
    }

    tryScrollToActive() {
        if (this.epgList && this.epgList.current && this.sideBarBody) {
            if (this.sideBarBody.offsetHeight > this.state.epg.length * 84) {
                return;
            }
            let activeEpgIndex = this.state.epg.indexOf(this.props.activeProgramId);
            if (activeEpgIndex === -1) {
                activeEpgIndex = this.state.epg.indexOf(this.props.currentChannel.currentProgramId);
            }
            if (activeEpgIndex !== -1) {
                if (activeEpgIndex * 84 > this.sideBarBody.offsetHeight / 2) {
                    window.sideBarBody = this.sideBarBody;
                    this.sideBarBody.scrollTop = activeEpgIndex * 84 - 84 * 2;
                }
            }
        }
    }

    componentDidMount() {
        const { currentChannel } = this.props;
        const { activeTab, epg } = this.state;
        if (!epg && !currentChannel.epgIsLoading) {
            this.props.getChannelEpg(currentChannel.id, activeTab);
        } else {
            this.tryScrollToActive();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { currentChannel } = this.props;
        const { activeTab, epg } = this.state;

        if (currentChannel && (prevProps.currentChannel.id !== currentChannel.id || prevState.activeTab !== activeTab)) {
            if (!epg && !currentChannel.epgIsLoading) {
                this.props.getChannelEpg(currentChannel.id, activeTab);
            }
        }
        if (prevProps.currentProgramId !== currentChannel.currentProgramId || prevProps.activeProgramId !== this.props.activeProgramId) {
            this.tryScrollToActive();
        }
    }

    setActiveTab = (activeTab) => {
        this.setState({ activeTab, epg: this.props.currentChannel.epgByDate && this.props.currentChannel.epgByDate[activeTab] });
    }

    onClickEpg = e => {
        const id = parseInt(e.currentTarget.id, 10);
        if (id) {
            const epg = this.props.currentChannel.epg[id];
            if (this.props.currentChannel.isOwn || (epg && (epg.dvr === 1 || (epg.dvr === -1 && epg.stop < Date.now())))) {
                this.props.switchToDvr(id);
            } else if (id === this.props.currentChannel.currentProgramId && id !== this.props.activeProgramId) {
                this.props.switchChannel(this.props.currentChannel.id);
            }
        }
    }

    render() {
        const { currentChannel } = this.props;
        const { calendar, activeTab, epg } = this.state;

        if (!currentChannel) return null;

        // const epg = filter(currentChannel.epg, item => item.startDate === activeTab);
        return (
            <SideBar right isOpen={true} onClose={this.handleClose}>
                <div className="sidebar-head">
                    <div className="sidebar-title">{t('TV Program')}</div>
                    <Carousel isSmall customClassName="calendar-tabs" step={150} duration={500} scrollToActiveOnLoad={true}>
                        {map(calendar, (day, id) => {
                            const isActiveClassName = day.date === activeTab ? 'active' : '';
                            return (
                                <div className={'carousel-item tab-day ' + isActiveClassName} key={id} onClick={() => this.setActiveTab(day.date)}>
                                    <div className="date">{day.value}</div>
                                    <div className="day">{day.dayName}</div>
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
                <div className="sidebar-body" ref={el => this.sideBarBody = el} key="b">
                    {epg && epg.length ?
                        <ChannelEPG
                            channelEpg={currentChannel.epg}
                            ids={epg}
                            currentProgramId={currentChannel.currentProgramId}
                            activeProgramId={this.props.activeProgramId}
                            key={activeTab}
                            onClick={this.onClickEpg}
                            ref={this.epgList}
                        />
                        : <div className="tac">{currentChannel.epgIsLoading ? '...' : t('TV Program is not available')}</div>}
                </div>
            </SideBar>
        );
    }
}

function createCalendar() {
    const daysBeforeToday = 7,
        daysAfterToday = 7,
        now = Date.now();
    let datesArray = [];
    for (let i = -daysBeforeToday; i <= daysAfterToday; i++) {
        const day = moment().subtract(i, 'days');
        datesArray.push({
            date: day.format('YYYY-MM-DD'),
            value: day.isSame(now, 'day') ? t('Today') :  day.format('DD MMM'),
            dayName: day.format('dd') });
    }
    return datesArray.reverse();
}

export default ChannelEPGSidebar;
