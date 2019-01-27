import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Match from '../snippets/Match';

export default class MatchDetails extends Component {
    static propTypes = {
        match: PropTypes.object,
    };
    render() {
        const { match } = this.props;
        if (!match) {
            return null;
        }

        return (
            <div className="player-details">
                <Match {...match} customClassName="no-hover" key={match.id}/>
            </div>
        );
    }
}
