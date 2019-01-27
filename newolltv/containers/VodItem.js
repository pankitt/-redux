import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Player from '../components/vod/Player';
import Details from '../components/vod/Details';
import Seasons from '../components/vod/Seasons';
import { getVideoItem, clearVideoItem, getRecommendations } from '../actions/videoItem';
import Carousel from '../components/carousel/Carousel';
import WithPoster from '../components/snippets/WithPoster';
import LoadingGrid from '../components/LoadingGrid';
import map from 'lodash/map';
import { createGrid } from '../helpers/createGrid';
import t from '../i18n';
import Error from '../components/Error';
import { clearMeta, addMeta } from '../helpers/metaTags';


class VodItem extends Component {
    static propTypes = {
        modal: PropTypes.object,
        id: PropTypes.number,
        mediaId: PropTypes.number,
        seasonId: PropTypes.number,
        episodeId: PropTypes.number,
        item: PropTypes.object,
        location: PropTypes.object,
        isLoading: PropTypes.bool,
        error: PropTypes.object,
        currentSeason: PropTypes.object,
        currentEpisode: PropTypes.object,
        prevEpisode: PropTypes.object,
        prevSeason: PropTypes.object,
        nextEpisode: PropTypes.object,
        nextSeason: PropTypes.object,
        history: PropTypes.object,
        videoItems: PropTypes.object,
        match: PropTypes.object,
        getVideoItem: PropTypes.func,
        setModalOrigin: PropTypes.func,
        clearVideoItem: PropTypes.func,
        getRecommendations: PropTypes.func,
        seekTime: PropTypes.number,
    }

    state = { error: false };

    setMeta(item, currentEpisode) {
        const title = `${item.title} ${item.originalTitle ? `(${item.originalTitle})` : ''} ${currentEpisode ? currentEpisode.title : ''}`;
        document.title = title;
        addMeta(
            { description: `${item.title} ${item.originalTitle ? `(${item.originalTitle})` : ''} ${currentEpisode ? currentEpisode.title : ''} ${t('watch online on OLL.TV')}` },
            {
                title,
                description: item.description,
                type: currentEpisode ? 'video.episode' : 'video.movie',
                url: window.location.href,
                image: item.poster,
            });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const { id, getVideoItem, getRecommendations } = this.props;
        getVideoItem(id).then(() => id === this.props.id ? getRecommendations(id) : null);
        this.checkHasDataForUrlParams();
        if (this.props.item) {
            this.setMeta(this.props.item, this.props.currentEpisode);
        }
    }

    componentWillUnmount() {
        this.props.clearVideoItem();
        clearMeta();
    }

    setActiveSeries = (episode) => {
        this.props.history.push(episode.url);
    }

    checkHasDataForUrlParams() {
        const item = this.props.episodeId ? this.props.currentEpisode : this.props.item;
        if (item && item.url !== this.props.location.pathname) {
            this.props.history.replace(item.url);
        }
    }

    componentDidUpdate(prevProps) {
        const id = this.props.id;
        if (prevProps.id !== id && !this.props.error) {
            this.checkHasDataForUrlParams();
            window.scrollTo(0, 0);
            this.props.getVideoItem(id).then(() => id === this.props.id ? this.props.getRecommendations(id) : null);
        }
        if ((!prevProps.item && this.props.item)
            || (prevProps.item && this.props.item && prevProps.item.title !== this.props.item.title)
            || (prevProps.currentEpisode !== this.props.currentEpisode)
        ) {
            this.setMeta(this.props.item, this.props.currentEpisode);
        }
    }

    componentDidCatch(error, info) {
        console.log(error);
        console.log(info);
        this.setState({ error: true });
    }

    render() {
        if (!this.props.isLoading && (this.props.error || !this.props.item) || (this.props.item && !this.props.item.seriesInfo && this.props.location.pathname !== this.props.item.url)) {
            return <Error {...this.props.error || { code: 400 }}/>;
        }

        const { id, item, videoItems } = this.props;
        const grid = createGrid('movie');
        let player, seasons, details, carousel;
        if (!this.state.error && item) {
            player = (
                <Player
                    item={item}
                    currentSeason={this.props.currentSeason}
                    currentEpisode={this.props.currentEpisode}
                    prevItem={this.props.prevEpisode}
                    onPrevItemClick={() => this.setActiveSeries(this.props.prevEpisode)}
                    nextItem={this.props.nextEpisode}
                    onNextItemClick={() => this.setActiveSeries(this.props.nextEpisode)}
                    mediaId={this.props.mediaId}
                    history={this.props.history}
                    seekTime={this.props.seekTime}
                    key={this.props.mediaId}/>
            );
            if (item.seriesInfo) {
                seasons = (
                    <Seasons seasonsIds={item.seriesInfo.seasons} seriesIds={item.seriesInfo.series} seasonId={this.props.seasonId} episodeId={this.props.episodeId} key="s" />
                );
            }
            details = (
                <Details {...item} key="dt"/>
            );
            if (item.recommendations) {
                carousel = (
                    <div className="section container" >
                        <h2 className="heading">{t('You may like')}</h2>
                        {!item.isLoading ? <Carousel gridClassName={grid + ' similar' + (item.isAmedia ? ' amedia' : '')}>
                            {map(item.recommendations, (id, a) => {
                                const recItem = videoItems.items[id];
                                return (
                                    <div className="carousel-item col" key={a}>
                                        <WithPoster {...recItem} link={recItem.url} isAmedia={item.isAmedia}/>
                                    </div>
                                );
                            })}
                        </Carousel> : <LoadingGrid grid={grid}/>}
                    </div>
                );
            }
        }
        return (
            <div className="page-vod-item with-payer-block" key={id}>
                {/* <div className="close-btn" onClick={() => this.props.history.goBack()}/> */}
                <div className="vod" itemScope itemType="http://schema.org/Movie">
                    {player}
                    {seasons}
                    {details}
                    {carousel}
                    {this.state.error ? <Error /> : null}
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    let parts = ownProps.match.params.url.split('-'),
        id = parts[0];

    const mediaId = parseInt(id, 10);
    const item = state.videoItems.items[ownProps.match.params.seriesId || id];

    let seasonId, episodeId, prevSeason, prevEpisode, currentSeason, currentEpisode, nextSeason, nextEpisode,
        seekTime = item ? item.seekTime : 0;
    if (ownProps.match.params.seriesId) {
        episodeId = mediaId;
        seasonId = parseInt(ownProps.match.params.seasonId, 10) || seasonId;
        // May be this part should be in getDerivedStateFromProps
        if (item && item.seriesInfo) {
            let episodesIds = null,
                seasonsIds = item.seriesInfo.seasons;
            if (seasonsIds && seasonId) {
                currentSeason = state.videoItems.seasons[seasonId];
                if (currentSeason) {
                    episodesIds = currentSeason.series;
                }
            } else {
                episodesIds = item.seriesInfo.series;
            }
            if (episodesIds.length) {
                const episode = state.videoItems.series[episodeId];
                currentEpisode = episode;
                if (episode) {
                    let prevEpId, nextEpId;
                    if (episodesIds.indexOf(episodeId) > 0) {
                        prevEpId = episodesIds[episodesIds.indexOf(episodeId) - 1];
                    } else if (currentSeason && seasonsIds.indexOf(seasonId) > 0) {
                        prevSeason = state.videoItems.seasons[seasonsIds[seasonsIds.indexOf(seasonId) - 1]];
                        prevEpId = prevSeason.series[prevSeason.series.length - 1];
                    }
                    if (episodesIds.indexOf(episodeId) < episodesIds.length - 1) {
                        nextEpId = episodesIds[episodesIds.indexOf(episodeId) + 1];
                    } else if (currentSeason && seasonsIds.indexOf(seasonId) < seasonsIds.length - 1) {
                        nextSeason = state.videoItems.seasons[seasonsIds[seasonsIds.indexOf(seasonId) + 1]];
                        nextEpId = nextSeason.series[0];
                    }
                    if (prevEpId) {
                        prevEpisode = state.videoItems.series[prevEpId];
                    }
                    if (nextEpId) {
                        nextEpisode = state.videoItems.series[nextEpId];
                    }
                    seekTime = episode.seekTime;
                }
            }
        }
    }
    return {
        id: parseInt(ownProps.match.params.seriesId, 10) || mediaId,
        episodeId,
        seasonId,
        prevEpisode,
        currentSeason,
        currentEpisode,
        nextEpisode,
        mediaId,
        item,
        seekTime,
        videoItems: state.videoItems,
        error: state.modal.error,
        isLoading: state.modal.isLoading,
    };
};
export default connect(mapStateToProps, { getVideoItem, clearVideoItem, getRecommendations })(VodItem);
