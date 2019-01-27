import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SideBar from '../sidebar/SideBar';
import ChannelHorizontal from '../snippets/ChannelHorizontal';
import ChannelsGenresCarousel from './ChannelsGenresCarousel';
import map from 'lodash/map';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import t from '../../i18n';

export default class MyChannelsSidebar extends Component {
    static propTypes = {
        channels: PropTypes.object.isRequired,
        currentChannel: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        switchChannel: PropTypes.func.isRequired,
        isSigned: PropTypes.bool.isRequired,
    };

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

    handleClose = () => {
        this.props.onClose();
    }

    handleTabClick = (id) => {
        const { activeTabID } = this.state;
        if (activeTabID !== id) {
            this.setActiveTab(id);
        }
    }

    setActiveTab = (genre) => {
        const { channels: { items } } = this.props;
        this.setState({
            activeTabID: genre,
            channelsGroupedByGenre: genre ?
                filter(this.state.channels,  id => items[id].genres.indexOf(genre) !== -1) :
                this.state.channels,
        }, () => this.scrollToActive());
    }

    switchChannel = e => {
        const id = parseInt(e.currentTarget.id, 10);
        if (id && this.props.channels.ids.indexOf(id) !== -1) {
            this.props.switchChannel(id);
        }
    }

    scrollToActive() {
        if (this.sideBarBody) {
            if (this.sideBarBody.offsetHeight > this.state.channelsGroupedByGenre.length * 70) {
                return;
            }
            const activeIndex = this.state.channelsGroupedByGenre.indexOf(this.props.currentChannel.id);
            if (activeIndex !== -1 && activeIndex * 75 > this.sideBarBody.offsetHeight / 2) {
                window.sideBarBody = this.sideBarBody;
                this.sideBarBody.scrollTop = activeIndex * 70 - 70 * 2;
            }
        }
    }

    componentDidMount() {
        this.scrollToActive();
    }

    render() {
        const { channels, isSigned, currentChannel } = this.props;
        const { activeTabID } = this.state;
        return (
            <SideBar isOpen={true} onClose={this.handleClose} width={530}>
                <div className="sidebar-head">
                    <div className="sidebar-title">{t('My channels')}</div>
                    {isSigned && this.state.genres.length > 1 ?
                        <ChannelsGenresCarousel
                            activeId={activeTabID}
                            genresIds={this.state.genres}
                            genres={this.props.channels.genres}
                            onClick={this.handleTabClick}
                        />
                        : null
                    }
                </div>
                <div className="sidebar-body" ref={el => this.sideBarBody = el} key="b">
                    {map(this.state.channelsGroupedByGenre, id => {
                        const isActiveClassName = Number(id) === Number(currentChannel.id) ? 'active' : '';
                        return <ChannelHorizontal { ...channels.items[id]} key={id} onClick={this.switchChannel} withActions={false} isActiveClassName={isActiveClassName}/>;
                    })}
                </div>
            </SideBar>
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
        if (channels[id].isPurchased) {
            result.push(id);
        }
        return result;
    }, []);
}
