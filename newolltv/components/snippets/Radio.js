import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Radio extends Component {
    static propTypes = {
        poster: PropTypes.string,
        link: PropTypes.string,
    }
    render() {
        const { poster, link } = this.props;

        return (
            <div className="snippet square">
                <Link to={link || '#'} style={{ width: '100%' }}>
                    <div className="poster" style={{ backgroundImage:'url(' + poster + ')' }}/>
                </Link>
            </div>
        );
    }
}
