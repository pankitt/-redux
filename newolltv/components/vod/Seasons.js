import React, { Component } from 'react';
import { connect } from 'react-redux';
import Carousel from '../carousel/Carousel';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import LoadingGrid from '../LoadingGrid';

class Seasons extends Component {
    static propTypes = {
        seasonId: PropTypes.number,
        episodeId: PropTypes.number.isRequired,
        seasonsIds: PropTypes.array,
        seriesIds: PropTypes.array,
        videoItems: PropTypes.object,
    };
    state = {
        seasonId: this.props.seasonId,
    };

    switchActiveSeason = e => {
        const id = parseInt(e.currentTarget.id, 10);
        if (id) {
            this.setState({ seasonId: id });
        }
    };

    render() {
        const { seasonsIds, seriesIds, episodeId, videoItems } = this.props;
        const { seasonId } = this.state;
        if (!seasonsIds && !seriesIds) return null;
        let episodesIds = seasonsIds ? videoItems.seasons[seasonId].series : seriesIds;
        const grid = 'grid cols-7@xxl cols-6@xl cols-5@l cols-4@ml cols-3@s cols-2@xs';
        return (
            <div className="seasons-block">
                <div className="container">
                    {seasonsIds && seasonsIds.length > 0 ?
                        <Carousel isSmall customClassName="season-names">
                            {map(seasonsIds, sId => {
                                let item = videoItems.seasons[sId];
                                const activeClassName = item.id === seasonId ? ' active' : '';
                                return (
                                    <div id={item.id} onClick={item.id === seasonId ? null : this.switchActiveSeason} className="carousel-item" key={item.id}>
                                        <div className={'season' + activeClassName}>{item.title}</div>
                                    </div>
                                );
                            })}
                        </Carousel> : null}
                    {episodesIds.length ?
                        <Carousel customClassName="series" gridClassName={grid}>
                            {map(episodesIds, episodesId => {
                                let item = videoItems.series[episodesId];
                                const activeClassName = item.id === episodeId ? ' active' : '';

                                let seekTimeProgressBar = (!item.viewPercentage || item.id === episodeId) ? null : (
                                    <div className="seek-time-progress-bar">
                                        <div style={{ width: item.viewPercentage + '%' }}></div>
                                    </div>
                                );

                                return (
                                    <Link replace={true} to={item.url || '#'} className={'carousel-item col series-item' + activeClassName} key={item.id}>
                                        <div className="series-poster" style={{ backgroundImage: 'url(' + item.poster + ')' }}>
                                            {seekTimeProgressBar}
                                        </div>
                                        <div className="series-title">{item.title}</div>
                                    </Link>
                                );
                            })}
                        </Carousel> : <LoadingGrid grid={grid}/>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        videoItems: state.videoItems,
    };
};

export default connect(mapStateToProps)(Seasons);
