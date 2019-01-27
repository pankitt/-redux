import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <header className="container">
                <div className="btn-group">
                    <Link to="/" className="btn btn-secondary">Main</Link>
                    <Link to="/users" className="btn btn-secondary">Users</Link>
                </div>
            </header>
        );
    }
}

export default Header;