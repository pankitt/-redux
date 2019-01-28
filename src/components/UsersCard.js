import React, { Component } from 'react';
import {connect} from "react-redux";
import { Link } from "react-router-dom";
import filter from 'lodash/filter'
import map from 'lodash/map';
import {getUsers} from "../actions/users";

class UsersCard extends Component {
    componentWillMount() {
        this.props.getUsers()
    }

    render() {
        const { users: { items }, userId } = this.props;
        const filterUser = filter(items, i => i.id === userId);

        return (
            <div>
                <h1>User:</h1>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Real Name</th>
                            <th>Nick</th>
                            <th>Phone</th>
                            <th>Website</th>
                        </tr>
                    </thead>
                    <tbody>
                    {map(filterUser, i => (
                        <tr key={i.id}>
                            <td>{i.name}</td>
                            <td>{i.username}</td>
                            <td>{i.phone}</td>
                            <td>{i.website}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Link to={"/users"} className="btn btn-primary">{'<< Back'}</Link>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let userId = +ownProps.match.params.id;
    return {
        userId,
        users: state.users
    }
};
const mapDispatchToProps = {
    getUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersCard);