import React, {Component, Fragment} from 'react';
import {getWorkers} from "../actions/workers";
import {connect} from "react-redux";
import map from 'lodash/map';
import filter from 'lodash/filter';

class Workers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: this.props.search.length ? +this.props.search.replace(/\D+/g,"") : 1
        };
    }
    
    componentDidMount() {
        this.props.getWorkers(this.state.page)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.page !== this.state.page) {
            this.props.getWorkers(this.state.page);
            this.props.history.replace(this.props.pathname + '?page' + this.state.page);
        }
    }

    workersList = (arr) => {
        const filterPage = filter(arr, { 'pageNum': this.state.page });
        return (
            map(filterPage, i => (
                <div className="card" key={i.id}>
                    <img src={i.picture} className="card-img-top" alt={i.picture}/>
                    <div className="card-body">
                        <h5 className="card-title">{i.id} {i.name}</h5>
                        <p className="card-text">{i.about}</p>
                    </div>
                </div>                
            ))
        )
    };
    prevItems = () => {
        this.setState(state => ({
            page: state.page - 1
        }));
    };
    nextItems = () => {
        this.setState(state => ({
            page: state.page + 1
        }));
    };
    paginator = () => {
        return (
            <Fragment>
                {this.state.page > 1 ? <button className="btn btn-primary mr-1" onClick={this.prevItems}>
                    Prev
                </button> : null}
                {this.state.page !== this.props.workers.page ? <button className="btn btn-primary" onClick={this.nextItems}>
                    Next
                </button> : null}
            </Fragment>

        )
    };

    render() {
        const { workers } = this.props;
        const showWorkers = this.workersList(workers.items);
        const paginator = this.paginator();

        return (
            <section>
                <h1 className="text-center pb-3">Workers List:</h1>
                <div className="d-flex justify-content-between flex-wrap">
                    {showWorkers}
                </div>
                <div className="text-center py-2">
                    {paginator}
                </div>
            </section>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        workers: state.workers,
        pathname: ownProps.location.pathname,
        search: ownProps.location.search
    }
};
const mapDispatchToProps = {
    getWorkers
};

export default connect(mapStateToProps, mapDispatchToProps)(Workers);