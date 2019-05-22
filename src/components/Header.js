import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <header className="container">
                <div className="btn-group">
                    <Link to="/" className="btn btn-secondary">Main</Link>
                    <Link to="/users" className="btn btn-secondary">Users</Link>
                    <Link to="/workers" className="btn btn-secondary">Workers</Link>
                    <Link to="/bets" className="btn btn-secondary">Bets</Link>
                    <Link to="/teaser" className="btn btn-secondary">Teaser</Link>
                    <Link to="/sport" className="btn btn-secondary">Sport</Link>
                </div>
            </header>
        );
    }
}

export default Header;