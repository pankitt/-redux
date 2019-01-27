import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AccountTabs from '../components/account/AccountTabs';

class Profile extends Component {
    static propTypes = {
        auth: PropTypes.object,
    }

    render() {
        return (
            <div className="page-profile">
                [eq]
                <AccountTabs />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
    };
};
export default connect(mapStateToProps)(Profile);
