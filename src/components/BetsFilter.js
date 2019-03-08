import React, { Component } from 'react';
import _ from 'lodash';

class BetsFilter extends Component {
    render() {
        const { eventId, outcames } = this.props;
        //console.log(this.props);
        
        const maxVal = _.maxBy(outcames, 'outcameCoef');
        const maxNum = num => num === maxVal.outcameCoef ? ' btn-outline-success ' : ' btn-outline-secondary ';

        return (
            <div className="list-group-item py-1">
                {eventId}
                <div className="btn-group ml-3">
                    {_.map(outcames, (i, key) => (
                        <button key={key} type="button" className={"btn" + maxNum(i.outcameCoef)}>{i.outcameCoef}</button>
                    ))}
                </div>
            </div>
        )
    }
}

export default BetsFilter;