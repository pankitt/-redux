import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import Match from '../components/snippets/Match';
import { Link } from 'react-router-dom';
import t from '../i18n';

class SoonMatches extends Component {
    render() {
        const { matches, topMatches } = this.props;
        return (
            <div className="section container">
                <h2 className="heading">{t('Top matches')}</h2>
                <div className="grid cols-2 cols-2@m cols-1@s">
                    { map(topMatches, (id, i) => {
                        const match = matches[id];
                        return (
                            <Link key={i} to={'/matches/' + id} className="col mb">
                                <Match {...match}/>
                            </Link>
                        );
                    }) }
                </div>
            </div>
        );
    }
}

SoonMatches.propTypes = {
    matches: PropTypes.object,
    topMatches: PropTypes.array,
};

const mapStateToProps = (state) => {
    return {
        matches: state.matches,
        topMatches: state.homePage.topMatches,
    };
};

export default connect(mapStateToProps)(SoonMatches);
