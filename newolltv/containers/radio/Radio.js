import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { getAllChannels } from '../../actions/radio';
import { createGrid } from '../../helpers/createGrid';
import { createLink } from '../../helpers/createLink';
import Carousel from '../../components/carousel/Carousel';
import RadioPlayer from './RadioPlayer';
import Radio from '../../components/snippets/Radio';
import map from 'lodash/map';
import t from '../../i18n';
import { clearMeta, addMeta } from '../../helpers/metaTags';

class RadioPage extends Component {
    static propTypes = {
        radio: PropTypes.object,
        currentStation: PropTypes.object,
        getAllChannels: PropTypes.func,
        isSigned: PropTypes.bool,
        id: PropTypes.number,
    };

    setMeta(channel) {
        if (channel) {
            const title = `${channel.title}`;
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
    }

    componentWillUnmount() {
        clearMeta();
    }

    componentDidMount() {
        if (!this.props.radio.ids.length) {
            this.props.getAllChannels();
        } else if (this.props.radio.items[this.props.id]) {
            this.setMeta(this.props.radio.items[this.props.id]);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id || (!prevProps.radio.ids.length && this.props.radio.ids.length && this.props.id)) {
            this.setMeta(this.props.radio.items[this.props.id]);
        }
    }

    render() {
        const { id, radio } = this.props;

        if (!radio.ids.length) {
            return null;
        } else if (!this.props.currentStation && radio.ids[0]) {
            return <Redirect to={createLink('radio', null, radio.ids[0])} />;
        }

        const grid = createGrid('radio');
        return (
            <div className="page-radio">
                <RadioPlayer channel={radio.items[id]} switchChannel={() => 0}/>
                <div className="section container">
                    <h2 className="heading">{t('Radio channels')}</h2>
                    <Carousel gridClassName={grid} customClassName="radio-snippets container">
                        {map(this.props.radio.ids, id => {
                            const item = this.props.radio.items[id];
                            const link = createLink('radio', null, id);
                            return (
                                <div className={'carousel-item col'} key={id}>
                                    <Radio {...item} link={link} />
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let currentStation = null;
    if (!!state.radio.ids.length && !!ownProps.match.params.id) {
        currentStation = state.radio.items[ownProps.match.params.id];
    }
    return {
        currentStation,
        radio: state.radio || {},
        id: ownProps.match.params.id | 0,
        isSigned: state.auth.signed,
    };
};
export default connect(mapStateToProps, { getAllChannels })(RadioPage);
