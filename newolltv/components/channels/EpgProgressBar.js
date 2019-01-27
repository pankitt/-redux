import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class EpgProgressBar extends Component {
    static propTypes = {
        start: PropTypes.number.isRequired,
        stop: PropTypes.number.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            now: Date.now(),
        };
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            const now = Date.now();
            if (now > this.props.stop) {
                clearInterval(this.interval);
                return;
            }
            this.setState({ now });
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        const position = (this.state.now - this.props.start) / (this.props.stop - this.props.start) * 100;
        return (
            <div className="epg-progressbar" style={{ width: position + '%' }}/>
        );
    }
}