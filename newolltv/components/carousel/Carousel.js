import React, { Component } from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';

export default class Carousel extends Component {
    static propTypes = {
        customClassName: PropTypes.string,
        isSmall: PropTypes.bool,
        scrollToActiveOnLoad: PropTypes.bool,
        step: PropTypes.number,
        duration: PropTypes.number,
        gridClassName: PropTypes.string,
        scrollAmount: PropTypes.number,
        children: PropTypes.node,
    }

    constructor(props) {
        super(props);
        this.state = {
            leftArr: true,
            rightArr: true,
            preventClick:false,
            scrollToActiveOnLoad: props.scrollToActiveOnLoad || false,
            isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
        };
        this.interval = null;
        this.step = props.step || 200;
        this.duration = props.duration || 500;
        this.K = 10;
    }

    componentDidMount() {
        if (!this.props.step && this.itemsContainer && this.itemsContainer.children[0]) {
            this.step = this.itemsContainer.children[0].offsetWidth;
        }
        if (this.state.scrollToActiveOnLoad) {
            this.scrollToActive();
        }
        this.setArrs();
    }

    scrollToActive = () => {
        const active = find(this.itemsContainer.children, item => item.classList.contains('active'));
        this.scrollContainer.scrollLeft = active.offsetLeft - (this.scrollContainer.offsetWidth / 2) + (active.offsetWidth / 2);
    }


    componentDidUpdate(prevProps) {
        if (prevProps.children.length !== this.props.children.length) {
            this.setArrs();
        }
    }

    setArrs = () => {
        let diff = 0;
        if (!this.state.isTouch) {
            if (!this.props.isSmall) {
                if (this.itemsContainer && this.itemsContainer.children[1]) {
                    diff = (this.itemsContainer.children[0].offsetWidth * this.props.children.length) - this.scrollContainer.offsetWidth - 10;
                }
            } else {
                diff = this.itemsContainer.offsetWidth - this.scrollContainer.offsetWidth - 10;
            }
            let scroll = this.scrollContainer.scrollLeft;
            this.setState({
                leftArr: scroll > 0,
                rightArr: scroll < diff,
            }, () => {
                if (scroll <= 0 || scroll >= diff) {
                    this.preventClick();
                }
            });
        }
    }

    preventClick = () => {
        this.timeout = setTimeout(() => {
            this.setState({
                preventClick : false,
            });
        }, 1000);
        this.setState({
            preventClick : true,
        });
    }

    left = () => {
        let from = this.scrollContainer.scrollLeft;
        this.animate((to) => this.scrollContainer.scrollLeft = from - to, () => this.setArrs());
    }

    right = () => {
        let from = this.scrollContainer.scrollLeft;
        this.animate((to) => this.scrollContainer.scrollLeft = from + to, () => this.setArrs());
    }

    /* eslint-disable no-param-reassign */
    animate = (todo, finish) => {
        clearInterval(this.interval);
        const ease = (t, b, c, d) => -c * ((t = t / d - 1) * t * t * t - 1) + b;
        let t = 0;
        this.interval = setInterval(() => {
            t += this.K;
            if (t > this.duration) {
                clearInterval(this.interval);
                finish();
            } else {
                todo(ease(t, 0, this.step, this.duration));
            }
        }, this.K);
    }

    _handleArrowClick = (arrow) => {
        // this.setArrs();
        clearInterval(this.interval);
        if (arrow === 'l') {
            this.left();
        } else {
            this.right();
        }
    }
    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    render() {
        const { customClassName, gridClassName, isSmall } = this.props;
        const { isTouch, leftArr, rightArr, preventClick } = this.state;
        const isSmallClassName = isSmall ? 'small' : '', isTouchClassName = isTouch ? 'touch' : '';
        return (
            <div className={'carousel usn ' + customClassName + ' ' + isSmallClassName} key="ch">
                <div className="carousel-wrapper">
                    {preventClick ? <div className="prevent"  key="ch">
                        <div className="left"/>
                        <div className="right"/>
                    </div> : null}
                    <div className={'carousel-inner ' + isTouchClassName} ref={el => this.scrollContainer = el} key="cin" /* onScroll={this.setArrs} */  onWheel={this.setArrs}>
                        <div className={'carousel-items ' + gridClassName} ref={el => this.itemsContainer = el} key="ci">
                            {this.props.children}
                        </div>
                    </div>
                    {!isTouch && (leftArr || rightArr) ? <div className="carousel-arrows">
                        {leftArr ? <div className="carousel-arrow left" onClick={() => this._handleArrowClick('l')}/> : null}
                        {rightArr ? <div className="carousel-arrow right" onClick={() => this._handleArrowClick('r')}/> : null}
                    </div> : null }
                </div>
            </div>
        );
    }
}
