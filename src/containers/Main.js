import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isLoaded } from '../actions/issues';
import { loadGithub } from '../actions/github';
import { plusCounter, minusCounter, clearCounter } from '../actions/counter';
import map from 'lodash/map';

const arr = [
    {id: 1, name: 'First'},
    {id: 2, name: 'Second'},
];

class Main extends Component {
    componentDidMount() {
        this.props.isLoaded(arr);
    }
    handleClick = () => {
        this.props.loadGithub();
    };

    render() {
        const { plusCounter, minusCounter, clearCounter, counter, github: {items} } = this.props;

        return (
            <section>
                <h1>Main</h1>
                <div>
                    <button className="btn btn-primary mr-2" onClick={plusCounter}>Counter + 1</button>
                    <button className="btn btn-primary mr-2" onClick={minusCounter}>Counter - 1</button>
                    <button className="btn btn-primary mr-2" onClick={clearCounter}>Counter 0</button>
                </div>
                <h3 className="my-3 text-success">Counter: {counter}</h3>
                <div>
                    <button className="btn btn-info mr-2" onClick={this.handleClick}>Loading from github</button>
                    <ul className="list-group my-3">{map(items, i => <li key={i.title} className="list-group-item">{i.title}</li>)}</ul>
                </div>

            </section>
        );
    }
}



const mapStateToProps = (state) => {
    return {
        counter: state.counter,
        issues: state.issues,
        github: state.github
    }
};
const mapDispatchToProps = {
    plusCounter,
    minusCounter,
    clearCounter,
    isLoaded,
    loadGithub,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);