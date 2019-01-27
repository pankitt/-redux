import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ScrollToTop extends Component {
    static propTypes = {
        location: PropTypes.object,
    }

    shouldComponentUpdate(nextProps) {
        return (!nextProps.location.search && !this.props.location.search) && nextProps.location !== this.props.location;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location !== this.props.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return null;
    }
}
