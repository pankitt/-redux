import React, { Component } from 'react';
import PropTypes from 'prop-types';


function scrollToTop(scrollDuration) {
    const scrollStep = -window.scrollY / (scrollDuration / 15),
        scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
}


export default class ScrollUp extends Component {
    static propTypes = {
        children: PropTypes.node,
    }

    constructor(props) {
        super(props);
        this.state = {
            showOverlay: false,
        };
    }

    handleScroll = () => {
        let showOverlay = false;
        if (document.body.scrollTop > 200) {
            showOverlay = true;
        }
        if (this.state.showOverlay !== showOverlay) {
            this.setState({ showOverlay });
        }
    }

    handleOverlayClick = () => {
        scrollToTop(300);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const { showOverlay } = this.state;
        const overlayClassName = showOverlay ? 'active' : '';
        return (
            <div className="scroll-up" onWheel={this.handleScroll} ref={el => this.scroll = el}>
                <div className={'scroll-up-overlay ' + overlayClassName} onClick={this.handleOverlayClick}></div>
                <div className="scroll-up-size"></div>
                <div className="container">
                    <div className="scroll-up-wrapper">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}
