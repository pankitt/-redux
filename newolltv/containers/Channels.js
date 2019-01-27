import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import ScrollUpChannels from '../components/scrollUp/ScrollUpChannels';
import Player from '../components/channels/Player';
import { getChannelEpg, getAllChannels } from '../actions/channels';
import find from 'lodash/find';
import t from '../i18n';
import { clearMeta, addMeta } from '../helpers/metaTags';
import moment from 'moment';

export const ChannelsPageContext = createContext({});

class Channels extends Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        channels: PropTypes.object,
        channelId: PropTypes.number,
        programId: PropTypes.number,
        currentChannel: PropTypes.object,
        currentProgram: PropTypes.object,
        prevChannel: PropTypes.object,
        nextChannel: PropTypes.object,
        getAllChannels: PropTypes.func.isRequired,
        getChannelEpg: PropTypes.func.isRequired,
        auth: PropTypes.object.isRequired,
        media: PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props);
        window.scrollTo(0, 0);
    }

    waitingForEpg = false;

    resetWaitingForEpg() {
        if (this.waitingForEpg) {
            this.waitingForEpg = false;
        }
    }

    setMeta(channel) {
        const title = `${channel.title} — ${t('watch online in high quality on OLL.TV')}`;
        document.title = title;
        addMeta(
            {
                description: channel.description,
            },
            {
                title,
                description: channel.description,
                type: 'video.other',
            }
        );
    }

    componentDidMount() {
        if (!this.props.channels.ids.length) {
            this.props.getAllChannels();
        }
        if (this.props.currentChannel) {
            this.setMeta(this.props.currentChannel);
        }
    }

    componentWillUnmount() {
        clearMeta();
        this.resetWaitingForEpg();
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentChannel && !this.props.currentProgram && !this.props.currentChannel.epgIsLoading) {
            this.resetWaitingForEpg();
            if (!this.props.currentChannel.epg) {
                this.props.getChannelEpg(this.props.currentChannel.id);
            } else if (this.props.programId && this.props.media.item.id === this.props.programId) {
                this.props.getChannelEpg(this.props.currentChannel.id, moment(this.props.media.item.startTimeTs * 1000).startOf('day').format('YYYY-MM-DD'));
            }
        }
        if (this.props.currentChannel && prevProps.currentChannel !== this.props.currentChannel) {
            this.setMeta(this.props.currentChannel);
        }
    }
    _getChannelEpg = id => {
        this.props.getChannelEpg(id);
    };

    switchChannel = id => {
        if (id) {
            this.props.history.replace('/channels/' + id);
        }
    }

    switchToDvr = id => {
        if (id) {
            this.props.history.replace(`/channels/${this.props.channelId}/${id}`);
        }
    }

    playNextDvrOrLive = () => {
        if (!this.props.programId) {
            return;
        }
        const { currentProgram, channelId, currentChannel: { epgByDate } } = this.props;
        if (currentProgram) {
            let startDate = moment(currentProgram.startDate);
            let epgForDay = epgByDate[startDate.format('YYYY-MM-DD')];
            if (epgForDay) {
                let currentProgramIndex = epgForDay.indexOf(currentProgram.id);
                if (currentProgramIndex !== -1) {
                    if  (currentProgramIndex < epgForDay.length - 1) {
                        this.switchToDvr(epgForDay[currentProgramIndex + 1]);
                        return;
                    }
                    const nextDay = startDate.add(1, 'd').format('YYYY-MM-DD');
                    epgForDay = epgByDate[nextDay];
                    if (!epgForDay || !epgByDate.length) {
                        this.waitingForEpg = true;
                        this.props.getChannelEpg(channelId, nextDay).then(() => {
                            if (this.waitingForEpg) {
                                const epgForDay = this.props.currentChannel.epgByDate[nextDay];
                                if (epgForDay && epgForDay.length) {
                                    this.switchToDvr(epgForDay[0]);
                                } else {
                                    this.switchChannel(channelId);
                                }
                            }
                        });
                        return;
                    }
                    this.switchToDvr(epgForDay[0]);
                    return;
                }
            }
        }
        this.switchChannel(channelId);
    }

    getChannelIdForRedirect() {
        console.log(123);
        const { items, ids, lastViewedChannelId }  = this.props.channels;

        if (lastViewedChannelId && items[lastViewedChannelId] && items[lastViewedChannelId].isPurchased) {
            return lastViewedChannelId;
        }

        const firstPurchased = find(ids, id => items[id].isPurchased);

        if (firstPurchased) {
            return firstPurchased;
        }

        if (lastViewedChannelId) {
            return lastViewedChannelId;
        }

        return ids[0];
    }

    goPayment = id => {
        this.props.history.push('/payment/' + id);
    }

    render() {
        const { channels, channelId, currentChannel, auth } = this.props;
        if (!channels.ids.length) {
            return null;
        }
        if (!channelId) {
            return <Redirect to={'/channels/' + this.getChannelIdForRedirect()} />;
        }
        if (!currentChannel) {
            return <Redirect to={'/channels/' + this.getChannelIdForRedirect()} />;
        }

        const hasNonPurchasedChannels = !!channels.notPurchasedChannelsIds.length;

        return (
            <div className="page-channels with-payer-block">
                <div className={'channels-overlay' + (hasNonPurchasedChannels ? ' fixed' : '')}>
                    <ChannelsPageContext.Provider
                        value={{
                            ...this.props,
                            switchChannel: this.switchChannel,
                            switchToDvr: this.switchToDvr,
                        }}
                    >
                        <Player
                            key="co"
                            currentChannel={currentChannel}
                            programId={this.props.programId}
                            switchChannel={this.switchChannel}
                            switchToDvr={this.switchToDvr}
                            auth={auth}
                            history={this.props.history}
                            playNextDvrOrLive={this.playNextDvrOrLive}
                        />
                    </ChannelsPageContext.Provider>
                </div>
                { hasNonPurchasedChannels ? <ScrollUpChannels channels={channels} getChannelEpg={this._getChannelEpg} epgIsLoading={channels.epgIsLoading} goPayment={this.goPayment}/> : null }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let channelId, programId, currentChannel = null, currentProgram, prevChannel, nextChannel;
    const channels = state.channels;
    if (ownProps.match.params.id) {
        channelId = parseInt(ownProps.match.params.id, 10) || channelId;
    }
    if (ownProps.match.params.programId) {
        programId = parseInt(ownProps.match.params.programId, 10) || programId;
    }
    if (channelId) {
        currentChannel = channels.items[channelId] || null;
    }
    if (currentChannel) {
        if (programId) {
            if (programId === currentChannel.currentProgramId) {
                currentProgram = find(currentChannel.nextThree, program => program.id === programId);
            } else if (currentChannel.epg) {
                currentProgram = find(currentChannel.epg, program => program.id === programId);
            }
        } else if (currentChannel.currentProgramId) {
            currentProgram = find(currentChannel.nextThree, program => program.id === currentChannel.currentProgramId);
        }
        if (channels.purchasedChannelsIds.indexOf(channelId) > 0) {
            prevChannel = channels.items[channels.purchasedChannelsIds[channels.purchasedChannelsIds.indexOf(channelId) - 1]];
        }
        if (channels.purchasedChannelsIds.indexOf(channelId) < channels.purchasedChannelsIds.length - 1) {
            nextChannel = channels.items[channels.purchasedChannelsIds[channels.purchasedChannelsIds.indexOf(channelId) + 1]];
        }
    }
    return {
        channelId,
        programId,
        currentChannel,
        currentProgram,
        prevChannel,
        nextChannel,
        channels,
        auth: state.auth,
        media: state.media,
    };
};
export default connect(mapStateToProps, { getAllChannels, getChannelEpg })(Channels);
