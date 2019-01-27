import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CarouselsList from './CarouselsList';
import ItemsList from './ItemsList';
import t from '../i18n';
import { clearMeta, addMeta } from '../helpers/metaTags';

class BlocksList extends Component {
    static propTypes = {
        lists: PropTypes.array,
        tabs: PropTypes.array,
        push: PropTypes.func,
        location: PropTypes.object,
        type: PropTypes.string,
        id: PropTypes.string,
    }

    setMeta() {
        let title, description;
        switch (this.props.id) {
            case 'moviesAndSeries':
                title = t('meta_moviesAndSeries_title');
                description = t('meta_moviesAndSeries_description');
                break;
            case 'programs':
                title = t('meta_programs_title');
                description = t('meta_programs_description');
                break;
            case 'kids':
                title = t('meta_kids_title');
                description = t('meta_kids_description');
                break;
            case 'music':
                title = t('meta_music_title');
                description = t('meta_music_description');
                break;
            default:
                title = 'OLL.TV';
                description = 'OLL.TV';
                break;
        }
        document.title = title;
        addMeta(
            {
                description,
            },
            {
                title,
                description,
            }
        );
    }

    componentDidMount() {
        this.setMeta();
        window.scrollTo(0, 0);
    }

    componentWillUnmount() {
        clearMeta();
    }

    render() {
        return (
            <div className={'page-' + this.props.id}>
                {this.props.lists.length ? <CarouselsList page={this.props.id} /> : null}
                {this.props.tabs.length ? <ItemsList {...this.props} inBlocksList /> : null}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const page = ownProps.id;
    return {
        ...ownProps,
        lists: state.config.menu[page].lists || [],
        tabs: state.config.menu[page].tabs || [],
    };
};

export default connect(mapStateToProps)(BlocksList);
