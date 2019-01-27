import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import getMain from '../actions/football/main';
import Carousel from '../components/carousel/Carousel';
import Matches from './Matches';
import map from 'lodash/map';
import Match from '../components/football/snippets/Match';
import Highlight from '../components/football/snippets/Highlight';
import t from '../i18n';
import { Link } from 'react-router-dom';
import LoadingGrid from '../components/LoadingGrid';
import { clearMeta, addMeta } from '../helpers/metaTags';
import { LIVE_STATUS_ENABLED } from '../constants';

class Football extends Component {
    static propTypes = {
        getMain: PropTypes.func,
        football: PropTypes.object,
        location: PropTypes.object,
        history: PropTypes.object,
    }

    setMeta() {
        const title = t('meta_football_title');
        document.title = title;
        addMeta({
            keywords: t('meta_football_match_keywords'),
            description: t('meta_football_description'),
        });
    }

    componentWillUnmount() {
        clearMeta();
    }

    componentDidMount() {
        this.props.getMain();
        this.setMeta();
    }
    createMatchLink = (match) => {
        if (match.liveStatus === LIVE_STATUS_ENABLED) {
            return '/football/' + match.id;
        }
        if (match.highlightId && !isNaN(match.highlightId)) {
            return '/football/' + match.id + '/' + match.highlightId;
        }
        if (match.highlights.length > 0) {
            return '/football/' + match.id + '/' + match.highlights[0];
        }
        return '/football/' + match.id;
    }

    render() {
        const { football: { matches, mainPage, highlights } } = this.props;
        return (
            <div className="page-matches">
                <div className="section container">
                    <h2 className="heading">{t('Best')}</h2>
                    {mainPage.topMatches.length ? <Carousel customClassName="carousel-main" gridClassName="grid cols-2 cols-2@l cols-1@ms cols-2@xxl">
                        {map(mainPage.topMatches, (id, i) => {
                            const item = matches[id];
                            return <Link className="carousel-item col" to={this.createMatchLink(item)}>
                                <Match isLarge {...item} key={i}/>
                            </Link>;
                        })}
                    </Carousel> : <LoadingGrid grid="grid cols-2 cols-2@l cols-1@ms cols-2@xxl football-main-carousel"/>}

                </div>
                <div className="section container">
                    <h2 className="heading">{t('Highlights')}</h2>
                    {mainPage.highlights.length ? <Carousel gridClassName="grid cols-4@xxl cols-3@xl cols-3@l cols-2@m cols-1@s ">
                        {map(mainPage.highlights, (id, i) => {
                            const highlight = highlights[id];
                            const match = matches[highlight.matchId];
                            return (
                                <Link className="carousel-item highlight col" key={i} to={'/football/' + match.id + '/' + id}>
                                    <Highlight highlight={highlight} match={match} withMatchDesc/>
                                </Link>
                            );
                        })}
                    </Carousel> : <LoadingGrid grid="grid cols-4@xxl cols-3@xl cols-3@l cols-2@m cols-1@s football-highlights-carousel"/>}

                </div>
                <div className="section container">
                    <Matches location={this.props.location} history={this.props.history}/>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        football: state.football,
    };
};
export default connect(mapStateToProps, { getMain })(Football);
