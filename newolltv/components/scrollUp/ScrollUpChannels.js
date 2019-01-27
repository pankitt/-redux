import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollUp from './index';
import ScrollUpEpg from './ScrollUpEpg';
import Carousel from '../carousel/Carousel';
import Channel from '../snippets/Channel';
import Button from '../Button';
import map from 'lodash/map';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import { inflect } from '../../helpers/string';
// import { goPayment } from '../../helpers/lincksToOldOllTV';
import ChannelsGenresCarousel from '../channels/ChannelsGenresCarousel';
import t from '../../i18n';

export default class ScrollUpChannels extends Component {
    static propTypes = {
        channels: PropTypes.object,
        getChannelEpg: PropTypes.func,
        goPayment: PropTypes.func,
        onChannelClick: PropTypes.func,
        epgIsLoading: PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(props, state) {
        if (props.channels.ids !== state.channelsIds) {
            const channels = getChannelsIds(props.channels.ids, props.channels.items, props.channels.genresIds);
            const genres = getChannelsGenres(channels, props.channels.items, props.channels.genresIds);
            const activeTabID = state.activeTabID && genres.indexOf(state.activeTabID) ? state.activeTabID : 0;
            return {
                channelsIds: props.channels.ids,
                channels,
                channelsGroupedByGenre: activeTabID ? filter(channels,  id => props.channels.items[id].genres.indexOf(activeTabID) !== -1) : channels,
                genres,
                activeChannelID: state.activeChannelID && channels.indexOf(state.activeChannelID) ? state.activeChannelID : channels[0],
                activeTabID,

            };
        }
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state
            || nextState.activeChannelID && !this.state.activeChannelID
            || nextProps.channels.items !== this.props.channels.items;
    }

    checkChannelHasEpg() {
        const activeChannelID = this.state.activeChannelID;
        if (activeChannelID && !this.props.channels.items[activeChannelID].epg && !this.props.channels.items[activeChannelID].epgIsLoading) {
            this.props.getChannelEpg(activeChannelID);
        }
    }
    componentDidUpdate() {
        this.checkChannelHasEpg();
    }

    componentDidMount() {
        this.checkChannelHasEpg();
    }

    setActiveChannel = (id) => {
        if (id !== this.state.activeChannelID) {
            this.setState({ activeChannelID: id }, () => this.checkChannelHasEpg());
        }
    }

    setActiveTab = (genre) => {
        const { channels: { items } } = this.props;
        this.setState({
            activeTabID: genre,
            channelsGroupedByGenre: genre ?
                filter(this.state.channels,  id => items[id].genres.indexOf(genre) !== -1) :
                this.state.channels,
        }, () => this.setActiveChannel(this.state.channelsGroupedByGenre[0]));
    }

    handleTabClick = (id) => {
        const { activeTabID } = this.state;
        if (activeTabID !== id) {
            this.setActiveTab(id);
        }
    }

    bundlesLength = (id) => {
        const { channels: { items } } = this.props;
        let count = 0,
            optimum = 0;
        const optimumIndex = 15212,
            premiumIndex = 15214;
        forEach(items, i => {
            if (i.subs) {
                if (i.subs.subsId === optimumIndex) optimum++;
                if (i.subs.subsId === id) count++;
            }
        });
        return (id === premiumIndex) ? count + optimum : count;
    };

    render() {
        if (!this.state.channels.length) {
            return null;
        }
        const { channels } = this.props;
        const { activeTabID, activeChannelID, channelsGroupedByGenre } = this.state;

        // const activeChannel = find(channels.items, item => item.id === activeChannelID);
        const activeChannel = channels.items[activeChannelID];

        const descriptionTemplate = activeChannel ? <div>
            <h1 className="title">{activeChannel.title}</h1>
            <div className="description">{activeChannel.description}</div>
        </div> : null;

        return (
            <ScrollUp>
                <div className="channels-head">
                    {this.state.channels.length ? <div className="heading">{t('And more')} <span>{this.state.channels.length}</span> {inflect(this.state.channels.length, t('inflect_channel'))}</div> : null}
                    {this.state.genres.length > 1 ?
                        <ChannelsGenresCarousel
                            activeId={activeTabID}
                            genresIds={this.state.genres}
                            genres={this.props.channels.genres}
                            onClick={this.handleTabClick}
                            channels = {channels.items}
                        />
                        : null
                    }
                </div>
                <div className="channels-carousel">
                    <Carousel gridClassName="grid cols-7@xxl cols-5@xl cols-5@l cols-4@ml cols-3@m cols-2@s cols-2@xs"  customClassName="channels-snippets" key={activeTabID} step={500}>
                        {map(channelsGroupedByGenre, id => {
                            const channel = channels.items[id];
                            const activeClassName = id === activeChannelID ? 'active' : '';
                            return (
                                <div className={'carousel-item col ' + activeClassName} key={id} onClick={() => this.setActiveChannel(id)}>
                                    <Channel {...channel} link={'/channels/' + channel.id} />
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
                <div className="channels-carousel-details">
                    {descriptionTemplate}
                    <div className="cta-block">
                        <div className="cta-block-text">
                            {t('Watch in subscription')}
                            <div className="text-large">{activeChannel.subs.name}</div>
                            <div className="channels-length">
                                {this.bundlesLength(activeChannel.subs.subsId)} {inflect(this.bundlesLength(activeChannel.subs.subsId), t('inflect_channel'))}
                            </div>
                        </div>
                        <Button isPrimary isLarge title={`${t('Buy for')} ${activeChannel.subs.price}грн`} onClick={() => this.props.goPayment(activeChannel.subs.subsId)}/>
                    </div>
                </div>
                <div className="channels-epg">
                    <div className="title">{t('TV Program')}</div>
                    <ScrollUpEpg epg={activeChannel.epg ? activeChannel.epg : {}} activeChannel={activeChannel}/>
                </div>
            </ScrollUp>
        );
    }
}

function getChannelsGenres(ids, channels, genresIds) {
    return ids.reduce(
        (result, channelId) => {
            forEach(channels[channelId].genres, genreId => {
                if (result.indexOf(genreId) === -1) {
                    result.push(genreId);
                }
            });
            return result;
        },
        []
    )
        .sort((a, b) =>  genresIds.indexOf(a) < genresIds.indexOf(b) ? -1 : 1);
}

function getChannelsIds(ids, channels) {
    return ids.reduce((result, id) => {
        if (!channels[id].isPurchased) {
            result.push(id);
        }
        return result;
    }, []);
}
