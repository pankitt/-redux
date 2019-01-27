import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import {} from 'react-spring';

export default class Poster extends Component {
    static propTypes = {
        itemFrames: PropTypes.array,
    };
    constructor(props) {
        super(props);
        this.state = {
            frameNumber: 0,
        };
        this.interval = null;
        this.intervalTime = 1000;
    }

    componentDidMount() {
        const { itemFrames } = this.props;
        if (itemFrames && itemFrames.length > 0) {
            this.createBackground();
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    createBackground = () => {
        const { itemFrames } = this.props;
        const frameNumber = Math.floor(Math.random() * itemFrames.length);
        this.setState({ frameNumber });
        // clearInterval(this.interval);
        // const numberOfFrames = itemFrames.length;
        // this.interval = setInterval(() => {
        //     this.setState({
        //         frameNumber: this.state.frameNumber + 1 < numberOfFrames ? this.state.frameNumber + 1 : 0,
        //     });
        // }, this.intervalTime);
    }

    render() {
        const { itemFrames } = this.props;
        const backgroundSrc = itemFrames && itemFrames.length > 0 ? itemFrames[this.state.frameNumber] : '';
        const defaultClassName = !backgroundSrc.length ? ' default ' : '';
        return <div className={'player-poster ' + defaultClassName} style={{ backgroundImage: 'url(' + backgroundSrc + ')' }} />;
    }
}
