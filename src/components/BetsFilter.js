import React, {Component, Fragment} from 'react';
import _ from 'lodash';

let allProps = [];
class BetsFilter extends Component {
    constructor(props){
        super(props);
        this.state = {
            //addProps: [],
            addNum: 0
        }
    }
    // createMax = () => {
    //     const { eventId, outcames } = this.props;
    //     const maxVal = _.maxBy(outcames, 'outcameCoef');
    //
    //     this.setState(state => ({
    //         addProps: state.addProps.push({eventId, ...maxVal})
    //     }))
    // };
    componentDidMount() {
        //this.createMax();
        const filtNum = _.groupBy(allProps, 'eventId');
        this.setState({addNum: filtNum});
    }

    render() {
        const { eventId, outcames } = this.props;
        const { addNum } = this.state;
        //console.log(this.props);
        
        const maxVal = _.maxBy(outcames, 'outcameCoef');
        allProps.push({eventId, ...maxVal});
        const maxValState = _.maxBy(addNum[eventId], 'outcameCoef');

        const maxNum = num => num === maxValState.outcameCoef ? ' btn-outline-success ' : ' btn-outline-secondary ';



        return (
            <Fragment>
                {maxValState ? <div className="list-group-item py-1">
                    {eventId}
                    <div className="btn-group ml-3">
                        {_.map(outcames, (i, key) => (
                            <button key={key} type="button" className={"btn" + maxNum(i.outcameCoef)}>{i.outcameCoef}</button>
                        ))}
                    </div>
                </div> : null}
            </Fragment>
        )
    }
}

export default BetsFilter;