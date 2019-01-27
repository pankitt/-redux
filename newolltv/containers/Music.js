import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Player from '../components/music/Player';
import { getVideoItem, clearVideoItem } from '../actions/videoItem';
import { getVideoItems } from '../actions/videoItems';
import Carousel from '../components/carousel/Carousel';
import WithPoster from '../components/snippets/WithPoster';
import LoadingGrid from '../components/LoadingGrid';
import map from 'lodash/map';
import { createGrid } from '../helpers/createGrid';
import { createName } from '../helpers/createName';
import Error from '../components/Error';

class Music extends Component {
    static propTypes = {
        modal: PropTypes.object,
        id: PropTypes.number,
        item: PropTypes.object,
        error: PropTypes.object,
        isLoading: PropTypes.bool,
        location: PropTypes.object,
        history: PropTypes.object,
        videoItems: PropTypes.object,
        getVideoItem: PropTypes.func,
        clearVideoItem: PropTypes.func,
        getVideoItems: PropTypes.func,
        collection: PropTypes.object,
    }

    state = { error: false };

    setMeta(item) {
        document.title = `OLL.TV ${item.title} ${item.originalTitle ? `(${item.originalTitle})` : ''}`;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const { id, getVideoItem } = this.props;
        getVideoItem(id)
            .then(
                () => {
                    if (id === this.props.id && this.props.item.collectionIds.length && !this.props.collection) {
                        this.props.getVideoItems('category', 'clips', '', '', '', '', this.props.item.collectionIds[0]);
                    }
                }
            );
        if (this.props.item) {
            this.setMeta(this.props.item);
        }
    }

    componentWillUnmount() {
        this.props.clearVideoItem();
    }

    componentDidUpdate(prevProps) {
        const id = this.props.id;
        if (prevProps.id !== id) {
            window.scrollTo(0, 0);
            this.props.getVideoItem(id);
        }
        if (this.props.item && prevProps.item !== this.props.item) {
            this.setMeta(this.props.item);
        }
    }

    componentDidCatch(error, info) {
        console.log(error);
        console.log(info);
        this.setState({ error: true });
    }

    render() {
        if (!this.props.isLoading && (this.props.error || !this.props.item) || (this.props.item && this.props.location.pathname !== this.props.item.url)) return <Error {...this.props.error || { code: 400 }}/>;
        const { id, item, videoItems, collection } = this.props;
        const grid = createGrid('movie');
        let player, carousel;
        if (!this.state.error && item) {
            player = (
                <Player
                    item={item}
                    mediaId={this.props.id}
                    history={this.props.history}
                    key={this.props.id}/>
            );
            if (this.props.collection) {
                carousel = (
                    <div className="section container">
                        <h2 className="heading">{collection.title}</h2>
                        {!item.isLoading ? <Carousel gridClassName={grid + ' similar'}>
                            {map(collection.ids, (id, a) => {
                                const colItem = videoItems.items[id];
                                return (
                                    <div className="carousel-item col" key={a}>
                                        <WithPoster {...colItem} link={colItem.url} />
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
                <div className="vod">
                    {player}
                    {carousel}
                    {this.state.error ? <div>Хм, щось пішло не так</div> : null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let parts = ownProps.match.params.url.split('-'),
        id = parseInt(parts[0], 10),
        type, genre, order, collectionId, collection;
    const item = state.videoItems.items[id];
    if (item && item.collectionIds && item.collectionIds.length) {
        collectionId = item.collectionIds[0];
        const name = createName('category', 'clips', type, genre, order, collectionId);
        collection = state.videoItems.lists[name];
    }


    return {
        id,
        item,
        collection,
        videoItems: state.videoItems,
        error: state.modal.error,
        isLoading: state.modal.isLoading,
    };
};

export default connect(mapStateToProps, { getVideoItem, clearVideoItem, getVideoItems })(Music);
