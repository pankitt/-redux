import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

export default function LoadingGrid(props) {
    return (
        <div className="carousel">
            <div className="carousel-wrapper">
                <div className="carousel-inner">
                    <div className={props.grid + ' loading-grid carousel-items'}>
                        {map(new Array(props.items || 10), (item, key) => {
                            return (
                                <div className="carousel-item col" key={key}>
                                    <div className="poster"></div>
                                </div>
                            );
                        }) }
                    </div>
                </div>
            </div>
        </div>
    );
}

LoadingGrid.propTypes = {
    grid: PropTypes.string,
    isCarousel: PropTypes.bool,
    items: PropTypes.string,
};
