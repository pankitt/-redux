import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Carousel extends Component {
    static propTypes = {
        customClassName: PropTypes.string,
        isSmall: PropTypes.bool,
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
            allowArrs: false,
            preventClick:false,
            isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
        };
        this.interval = null;
        this.step = props.step || 200;
        this.duration = props.duration || 500;
        this.K = 5;
    }
    componentDidMount() {
        this.setArrs();
    }
    setArrs = () => {
        let diff = this.itemsContainer.offsetWidth - this.scrollContainer.offsetWidth - 10;
        let scroll = this.scrollContainer.scrollLeft;
        this.setState({
            allowArrs: diff > 0,
            leftArr: !(scroll <= 0),
            rightArr: !(scroll >= diff),
        }, () => {
            if (scroll <= 0 || scroll >= diff) {
                this.preventClick();
            }
        });
    }

    preventClick = () => {
        setTimeout(() => {
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
        this.setArrs();
        clearInterval(this.interval);
        if (arrow === 'l') {
            this.left();
        } else {
            this.right();
        }
    }

    render() {
        const { customClassName, gridClassName, isSmall } = this.props;
        const { isTouch, leftArr, rightArr, preventClick } = this.state;
        const isSmallClassName = isSmall ? 'small' : '';
        return (
            <div className={'carousel usn ' + customClassName + ' ' + isSmallClassName}>
                <div className="carousel-wrapper">
                    {preventClick ? <div className="prevent"></div> : null}
                    <div className="carousel-inner" ref={el => this.scrollContainer = el} key="qq" onScroll={this.setArrs} onWheel={this.setArrs}>
                        <div className={'carousel-items ' + gridClassName} ref={el => this.itemsContainer = el} >
                            {this.props.children}
                        </div>
                    </div>
                    {!isTouch ? <div className="carousel-arrows">
                        {leftArr ? <div className="carousel-arrow left" onClick={() => this._handleArrowClick('l')}/> : null}
                        {rightArr ? <div className="carousel-arrow right" onClick={() => this._handleArrowClick('r')}/> : null}
                    </div> : null }
                </div>
            </div>
        );
    }
}
