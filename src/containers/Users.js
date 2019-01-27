import React, {Component} from 'react';
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import map from 'lodash/map';
import {getUsers} from "../actions/users";

class Users extends Component {
    componentWillMount() {
        this.props.getUsers()
    }

    usersList = (arr) => {
        return (
            map(arr, i => (
                <tr key={i.id}>
                    <td>{i.id}</td>
                    <td><Link to={`/users/${i.id}`}>{i.username}</Link></td>
                </tr>
                ))
        )
    };

    render() {
        const { users: { items } } = this.props;
        const addUsers = this.usersList(items);
        
        return (
            <section>
                <h1>Users List:</h1>
                <table className="table table-bordered">
                    <tbody>
                        {addUsers}
                    </tbody>
                </table>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
};
const mapDispatchToProps = {
    getUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);