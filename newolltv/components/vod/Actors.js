import React from 'react';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import last from 'lodash/last';

export default function Actors(props) {
    const { actors, customClassName } = props;
    const actorsTemplate = map(actors.split(','), (actor, i) => {
        const actorArray = actor.split(' '),
            surname = last(actorArray);
        actorArray.pop();
        return (
            <div className="actor" key={i} itemProp="actor" itemScope itemType="http://schema.org/Person">
                <meta itemProp="name" content={actor} />
                <div>{actorArray.join(' ')}</div>
                <div className="surname">{surname}</div>
            </div>
        );
    });
    return (
        <div className={'actors ' + customClassName}>
            {actorsTemplate}
        </div>
    );
}

Actors.propTypes = {
    actors: PropTypes.array,
    customClassName: PropTypes.string,
};
