import React, {Component, Fragment} from 'react';
import _ from 'lodash';

class BetsFilter extends Component {
    render() {
        const {outcames, eventId} = this.props;
        return (
            <Fragment>
                <div className="list-group-item py-1">
                    {eventId}
                    <div className="btn-group ml-3">
                        {_.map(outcames, (i, key) => (
                            <button key={key} type="button" className="btn btn-outline-secondary">{i.outcameCoef}</button>
                        ))}
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default BetsFilter;