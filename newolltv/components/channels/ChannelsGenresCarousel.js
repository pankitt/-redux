import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import Carousel from '../carousel/Carousel';
import t from '../../i18n';
import filter from 'lodash/filter';

export default class ChannelsGenresCarousel extends Component {
    static propTypes = {
        activeId: PropTypes.number.isRequired,
        genres: PropTypes.object.isRequired,
        genresIds: PropTypes.array.isRequired,
        onClick: PropTypes.func.isRequired,
        channels: PropTypes.object.isRequired,
    };
    onClick = e => {
        const id = parseInt(e.currentTarget.id, 10);
        if (id === 0 || id && this.props.genresIds.indexOf(id) !== -1) {
            this.props.onClick(id);
        }
    };
    hasGenres = (chanId) => {
        const { channels } = this.props;
        const addGenre = filter(channels, channel => +channel.genres === +chanId && channel.isPurchased === false);
        return addGenre.length;
    };
    render() {
        return (
            <Carousel isSmall customClassName="channels-tabs" step={150} duration={500}>
                <div id={0} className="carousel-item" key={0} onClick={this.onClick}>
                    <div className={!this.props.activeId ? 'genre active' : 'genre'}>{t('All')}</div>
                </div>
                {map(this.props.genresIds, id => {
                    const numGenres = this.hasGenres(id);
                    return (
                        <div id={id} className="carousel-item" key={id} onClick={this.onClick}>
                            <div className={id === this.props.activeId ? 'genre active' : 'genre'}
                            >{this.props.genres[id].name} <em>{numGenres}</em></div>
                        </div>
                    );
                })}
            </Carousel>
        );
    }
}
