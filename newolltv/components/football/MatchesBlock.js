import React from 'react';
import PropTypes from 'prop-types';

export default function MatchesBlock({ customTitleClassName, title, children, isLive, loading }) {
    if (!loading) {
        const isLiveTitle = isLive ? <span className="live"> LIVE</span> : null;
        return (
            <div>
                <p className={'matches-date ' + customTitleClassName}>{title}{isLiveTitle}</p>
                <div className="matches-grid grid cols-2 cols-1@s">
                    {children}
                </div>
            </div>
        );
    }
    return (
        <div className="loading-block">
            <p className="matches-date"></p>
            <div className="matches-grid grid cols-2 cols-1@s">
                <div className="col">
                    <div className="snippet match"></div>
                </div>
                <div className="col">
                    <div className="snippet match"></div>
                </div>
                <div className="col">
                    <div className="snippet match"></div>
                </div>
            </div>
            <p className="matches-date"></p>
            <div className="matches-grid grid cols-2 cols-1@s">
                <div className="col">
                    <div className="snippet match"></div>
                </div>
                <div className="col">
                    <div className="snippet match"></div>
                </div>
                <div className="col">
                    <div className="snippet match"></div>
                </div>
                <div className="col">
                    <div className="snippet match"></div>
                </div>
                <div className="col">
                    <div className="snippet match"></div>
                </div>
            </div>
        </div>
    );
}

MatchesBlock.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    customTitleClassName: PropTypes.string,
    isLive: PropTypes.bool,
    loading: PropTypes.bool,
};
