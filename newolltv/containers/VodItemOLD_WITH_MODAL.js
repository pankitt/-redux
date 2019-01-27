import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { connect } from 'react-redux';
import PlayerWithOverlay from '../components/vod/PlayerWithOverlay';

import Details from '../components/vod/Details';
import Seasons from '../components/vod/Seasons';
import Carousel from '../components/carousel/Carousel';
import WithPoster from '../components/snippets/WithPoster';
import { setModalOrigin } from '../actions/modal';
import { getVideoItem, clearVideoItem, getMedia } from '../actions/videoItem';
import map from 'lodash/map';


class VodItem extends Component {
    static propTypes = {
        modal: PropTypes.object,
        itemId: PropTypes.string,
        item: PropTypes.object,
        amedia: PropTypes.object,
        history: PropTypes.object,
        dispatch: PropTypes.func,
        getVideoItem: PropTypes.func,
        setModalOrigin: PropTypes.func,
        clearVideoItem: PropTypes.func,
        getMedia: PropTypes.func,
    }
    setModalOrigin = (origin) => {
        this.props.setModalOrigin(origin, false);
    }
    _handleModalClose = () => {
        this.props.history.push('/vod');
        this.props.clearVideoItem();
    }
    componentWillMount() {
        const { itemId, getVideoItem, getMedia } = this.props;
        getVideoItem(itemId);
        getMedia(itemId);
    }
    componentWillUnmount() {
        this.props.clearVideoItem();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.itemId !== this.props.itemId) {
            const { itemId, getVideoItem } = nextProps;
            getVideoItem(itemId);
        }
    }
    render() {
        const { modal:{ origin, transform, item }, itemId, amedia } = this.props;

        if (!Object.keys(item).length) return null;

        return (
            {/* <Modal origin={origin} transform={transform} key={itemId} onClose={this._handleModalClose}>*/}
            <div>
                <div className="vod">
                    <PlayerWithOverlay {...item}/>
                    <Seasons {...item.seriesInfo}/>
                    <Details {...item}/>
                    <div className="section container">
                        <h2 className="heading">Вам может понравиться</h2>
                        <Carousel gridClassName="grid cols-7@xxl cols-6@xl cols-5@l cols-4@ml cols-2@s cols-1@xs">
                            {map(amedia.items, (item, a) => {
                                return (
                                    <div className="carousel-item highlight col" key={a}>
                                        <WithPoster {...item} link={'/vod/' + item.id} setSnippetOrigin={this.setModalOrigin}/>
                                    </div>
                                );
                            })}
                        </Carousel>
                    </div>
                </div>
                <div className="h50"></div>
            </div>
            {/* </Modal> */}
        );
    }
}
const mapStateToProps = (state, ownProps) => {
    const itemId =  ownProps.match.params.id;
    return {
        itemId,
        amedia: state.amedia,
        modal: state.modal,
    };
};
export default connect(mapStateToProps, { setModalOrigin, getVideoItem, clearVideoItem, getMedia })(VodItem);
