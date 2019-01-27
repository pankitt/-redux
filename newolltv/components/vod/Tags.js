import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';

export default function Tags(props) {
    return props.tagsOrder && props.tagsOrder.length ?
        <div className="tags">
            {map(props.tagsOrder, i => <div className="tag" key={i} itemProp="genre">{props.tags[i]}</div>)}
        </div> : null;
}

Tags.propTypes = {
    tagsOrder: PropTypes.array,
    tags: PropTypes.object,
};