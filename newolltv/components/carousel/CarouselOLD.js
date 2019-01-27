import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ease from '../../helpers/scrollEase';

export default class Carousel extends Component {
    static propTypes = {
        customClassName: PropTypes.string,
        isSmall: PropTypes.bool,
        gridClassName: PropTypes.string,
        scrollAmount: PropTypes.number,
        children: PropTypes.node,
    }
    constructor(props) {
        super(props);
        this.state = {
            intervalTime: 10,
            duration: 500,
            showArrs: {
                left: true,
                right: true,
            },
            isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
        };
    }

    componentDidMount() {
        this.setArrs();
    }

    setArrs() {
        // let showArrs = this.state.showArrs;
        if (this.props.isSmall && this.scrollContainer.offsetWidth > this.itemsContainer.offsetWidth) {
            this.setState({
                showArrs: {
                    left: false,
                    right: false,
                },
            });
        } else {
            // if (this.scrollContainer.scrollLeft === 0) {
            //     showArrs = {
            //         left: false,
            //         right: true,
            //     };
            // } else if (this.scrollContainer.scrollLeft === this.itemsContainer.offsetWidth - this.scrollContainer.offsetWidth - 10) {
            //     showArrs = {
            //         left: true,
            //         right: false,
            //     };
            // } else {
            //     showArrs = {
            //         left: true,
            //         right: true,
            //     };
            // }
            // this.setState({ showArrs });
        }
    }

    left = () => {
        let from = this.scrollContainer.scrollLeft;
        this.animate((to) => this.scrollContainer.scrollLeft = from - to, () => this.setArrs());
    }
    right= () => {
        let from = this.scrollContainer.scrollLeft;
        this.animate((to) => this.scrollContainer.scrollLeft = from + to, () => this.setArrs());
    }
    clearStateInterval = () => {
        clearInterval(this.interval);
    }
    animate = (todo, finish) => {
        this.clearStateInterval();
        let ct = 0;
        this.interval = setInterval(() => {
            ct += this.state.intervalTime;
            if (ct > this.state.duration) {
                this.clearStateInterval();
                finish();
            } else {
                let itemWidth = this.itemsContainer && this.itemsContainer.children[0] ? this.itemsContainer.children[0].offsetWidth : 0;
                if (this.props.scrollAmount) {
                    itemWidth = this.props.scrollAmount;
                }
                todo(ease(ct, 0, itemWidth, this.state.duration));
            }
        }, this.state.intervalTime);
    }
    _handleArrowClick = (arrow) => {
        let f = arrow === 'l' ? this.left : this.right;
        this.scroll = setInterval(f, 20);
        this.setArrs();
    }

    render() {
        const { customClassName, gridClassName, isSmall } = this.props;
        const { isTouch, showArrs } = this.state;
        const isSmallClassName = isSmall ? 'small' : '';
        return (
            <div className={'carousel usn ' + customClassName + ' ' + isSmallClassName}>
                <div className="carousel-wrapper">
                    <div className="carousel-inner" ref={el => this.scrollContainer = el} key="qq" >
                        <div className={'carousel-items ' + gridClassName} ref={el => this.itemsContainer = el} >
                            {this.props.children}
                        </div>
                    </div>
                    {!isTouch ? <div className="carousel-arrows">
                        {showArrs.left ? <div className="carousel-arrow left" onMouseDown={() => this._handleArrowClick('l')} onMouseUp={() => clearInterval(this.scroll)}/> : null}
                        {showArrs.right ? <div className="carousel-arrow right" onMouseDown={() => this._handleArrowClick('r')} onMouseUp={() => clearInterval(this.scroll)}/> : null}
                    </div> : null }
                </div>
            </div>
        );
    }
}
