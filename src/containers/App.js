import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/index.scss';
import { Route, Switch, withRouter } from 'react-router';

import Header from '../components/Header';
import Main from './Main';
import Users from "./Users";
import UsersCard from "../components/UsersCard";
import CreateUser from "../components/CreateUser";
import Workers from "./Workers";

import { connect } from 'react-redux';
//import * as LoadGithub from '../actions/github';


class App extends Component {
    componentDidMount() {
        //this.props.dispatch(LoadGithub.loadAll());
    }


    render() {
        if (!this.props.initialized) return null;
        return (
            <div className="App">
              <Header />
              <div className="container">
                <Switch>
                    <Route strict exact path="/" component={Main} />
                    <Route strict exact path="/users" component={Users} />
                    <Route strict path="/users/:id" component={UsersCard} />
                    <Route strict exact path="/addUser" component={CreateUser} />
                    <Route strict exact path="/workers" component={Workers} />
                </Switch>
              </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        initialized: state.app.initialized,
    };
};

export default withRouter(connect(mapStateToProps)(App));
