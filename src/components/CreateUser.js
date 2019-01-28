import React, { Component } from 'react';
import {connect} from "react-redux";
//import { Link } from "react-router-dom";
import {postUser} from "../actions/addUser";

class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username: '',
            phone: '',
            website: '',
        };
    }

    onInputChange = (event) => {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    };

    onSubmit = (event) => {
        event.preventDefault();
        const params = {
            name: this.state.name,
            username: this.state.username,
            phone: this.state.phone,
            website: this.state.website,
        };
        this.props.postUser(params);
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label> Name:
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            value={this.state.name}
                            onChange={this.onInputChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label> Username:
                        <input
                            className="form-control"
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.onInputChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label> Phone:
                        <input
                            className="form-control"
                            type="text"
                            name="phone"
                            value={this.state.phone}
                            onChange={this.onInputChange}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label> Website:
                        <input
                            className="form-control"
                            type="text"
                            name="website"
                            value={this.state.website}
                            onChange={this.onInputChange}
                        />
                    </label>
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
};
const mapDispatchToProps = {
    postUser
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);