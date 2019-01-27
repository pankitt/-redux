import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Carousel from '../components/carousel/Carousel';
import LoadingGrid from '../components/LoadingGrid';
import WithPoster from '../components/snippets/WithPoster';
import Channel from '../components/snippets/Channel';
import Radio from '../components/snippets/Radio';
import YouMayLike from '../components/carousel/snippets/YouMayLike';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import { Link } from 'react-router-dom';
// import { setModalOrigin } from '../actions/modal';
import getCarousel from '../actions/carousels';
import { removeFromContinueView } from '../actions/carousels';
import { getAllChannels as getAllTvChannels } from '../actions/channels';
import { getAllChannels as getAllRadioChannels } from '../actions/radio';
import { updateListPage } from '../actions/itemsListPage';
import { createGrid } from '../helpers/createGrid';
import { createLink } from '../helpers/createLink';
import { createName } from '../helpers/createName';
import {
    RADIO_CAROUSEL_PRESET_ID,
    CHANNELS_CAROUSEL_PRESET_ID,
    CONTINUE_VIEW_CAROUSEL_PRESET_ID,
    YOU_MAY_LIKE_CAROUSEL_PRESET_ID,
    CONTENT_TYPE_HEADER_SERIES_ID,
    CONTENT_TYPE_HEADER_SHOW_ID,
} from '../constants';
import t from '../i18n';

class CarouselsList extends Component {
    static propTypes = {
        title: PropTypes.string,
        lists: PropTypes.array,
        page: PropTypes.string,
        carousels: PropTypes.object,
        videoItems: PropTypes.object,
        channels: PropTypes.object,
        radio: PropTypes.object,
        getCarousel: PropTypes.func,
        getAllTvChannels: PropTypes.func,
        getAllRadioChannels: PropTypes.func,
        updateListPage: PropTypes.func,
        removeFromContinueView: PropTypes.func,
    }

    // setModalOrigin = (origin) => {
    //     this.props.setModalOrigin(origin, true, '/vod');
    // }

    setMeta(title) {
        document.title = 'OLL.TV ' + title;
    }

    componentDidMount() {
        const { lists, channels, radio, carousels, getCarousel } = this.props;
        forEach(lists, item => {
            const { action, id, type } = item.preset;
            switch (id) {
                case CHANNELS_CAROUSEL_PRESET_ID:
                    if (!channels.ids.length) {
                        this.props.getAllTvChannels();
                    }
                    break;
                case RADIO_CAROUSEL_PRESET_ID:
                    if (!radio.ids.length) {
                        this.props.getAllRadioChannels();
                    }
                    break;
                default:
                    if (!carousels[createName(action, id, type)]) {
                        getCarousel(action, id, type, item.title);
                    }
            }
        });
        if (this.props.title) {
            this.setMeta(this.props.title);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.title !== this.props.title) {
            this.setMeta(this.props.title);
        }
    }

    onCloseBtnClick(e, id) {
        e.preventDefault();
        if (!this.props.carousels.isRemovingItem) {
            this.props.removeFromContinueView(id);
        }
    }

    render() {
        const { lists, videoItems, channels, radio, carousels } = this.props;
        let visibleLists = lists.filter((list) => list.visible !== false);
        return (
            <div className="carousels-list">
                {map(visibleLists, (list, key) => {
                    let gridCssName = list.preset.type === 'amedia' ? 'amedia' : list.preset.id;
                    let grid = createGrid(gridCssName);
                    let carousel = (
                        <LoadingGrid grid={grid + ' ' + gridCssName}/>
                    );
                    if (list.preset.id === CHANNELS_CAROUSEL_PRESET_ID) {
                        if (channels.ids.length) {
                            carousel = (
                                <Carousel gridClassName={grid} customClassName="channels-snippets">
                                    {map(channels.ids, id => {
                                        const item = channels.items[id];
                                        const link = createLink(list.preset.id, null, id);
                                        return (
                                            <div className={'carousel-item col'} key={id}>
                                                <Channel {...item} link={link} />
                                            </div>
                                        );
                                    })}
                                </Carousel>
                            );
                        }
                    } else if (list.preset.id === RADIO_CAROUSEL_PRESET_ID) {
                        if (radio.ids.length) {
                            carousel = (
                                <Carousel gridClassName={grid + ' ' + gridCssName} customClassName="radio-snippets">
                                    {map(radio.ids, id => {
                                        const item = radio.items[id];
                                        const link = createLink(list.preset.id, null, id);
                                        return (
                                            <div className={'carousel-item col'} key={id}>
                                                <Radio {...item} link={link} />
                                            </div>
                                        );
                                    })}
                                </Carousel>
                            );
                        }
                    } else {
                        let data = carousels[createName(list.preset.action, list.preset.id, list.preset.type)];
                        if (data) {
                            if (!data.ids.length) {
                                return null;
                            }
                            if (list.preset.id === CONTINUE_VIEW_CAROUSEL_PRESET_ID) {
                                let itemsElements = map(data.ids, (id, a) => {
                                    const item = videoItems.items[id];

                                    return (
                                        <div className="carousel-item col" key={a}>
                                            <WithPoster
                                                {...item}
                                                link={item.url}
                                                showAmediaCover={false}
                                                closeBtn={true}
                                                onCloseBtnClick={(e) => this.onCloseBtnClick(e, id)}
                                                showViewPercentage={[
                                                    CONTENT_TYPE_HEADER_SERIES_ID,
                                                    CONTENT_TYPE_HEADER_SHOW_ID,
                                                ].indexOf(item.typeId) === -1} />
                                        </div>
                                    );
                                });

                                if (data.ids.length < 20) {
                                    data = carousels[createName('list', YOU_MAY_LIKE_CAROUSEL_PRESET_ID)];

                                    if (data) {
                                        itemsElements.push(<YouMayLike/>);
                                        itemsElements = itemsElements.concat(map(data.ids, (id, a) => {
                                            const item = videoItems.items[id];
                                            return (
                                                <div className="carousel-item col" key={a + data.ids.length}>
                                                    <WithPoster {...item} link={item.url} showAmediaCover={false}/>
                                                </div>
                                            );
                                        }));
                                    }
                                }

                                carousel = (
                                    <Carousel gridClassName={grid + ' ' + gridCssName}>
                                        {itemsElements}
                                    </Carousel>
                                );
                            } else {
                                if (list.preset.action === 'list' && list.preset.id === 'kids') {
                                    grid = createGrid('bigPosters');
                                }
                                carousel = (
                                    <Carousel gridClassName={grid + ' ' + gridCssName}>
                                        {map(data.ids, (id, a) => {
                                            const item = videoItems.items[id];
                                            return (
                                                <div className="carousel-item col" key={a}>
                                                    <WithPoster {...item} link={item.url}/>
                                                </div>
                                            );
                                        })}
                                    </Carousel>
                                );
                            }
                        }
                    }

                    return (
                        <div className="section container" key={key}>
                            <h2 className="heading">
                                {list.title}
                                {list.routeToAll ? <Link to={'/' + list.routeToAll} className="heading-link link">{t('See all')}</Link> : null}
                            </h2>
                            {carousel}
                            {list.preset.type === 'amedia' ? <div className="amediaCopy">© 2017 Home Box Office, Inc. All rights reserved. HBO® and all related service marks are the property of Home Box Office, Inc.</div> : null}
                        </div>
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const page = ownProps.page;
    return {
        title: state.config.menu[page].title,
        lists: state.config.menu[page].lists,
        carousels: state.carousels,
        videoItems: state.videoItems,
        channels: state.channels,
        radio: state.radio,
    };
};
export default connect(mapStateToProps, { getCarousel, getAllTvChannels, getAllRadioChannels, updateListPage, removeFromContinueView })(CarouselsList);
