import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import find from 'lodash/find';
import map from 'lodash/map';
import moment from 'moment';

export default class CarouselEpg extends Component {
    static propTypes = {
        customClassName: PropTypes.string,
        isSmall: PropTypes.bool,
        scrollToActiveOnLoad: PropTypes.bool,
        step: PropTypes.number,
        duration: PropTypes.number,
        currentProgramId: PropTypes.number,
        epg: PropTypes.object,
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
            scrollToActiveOnLoad: true,
            isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
        };
        this.interval = null;
        this.step = 500;
        this.duration = 300;
        this.K = 10;
    }

    componentDidMount() {
        setTimeout(() => {
            this.setArrs();
            if (this.state.scrollToActiveOnLoad) {
                this.scrollToActive();
            }
        }, 500);
    }

    scrollToActive = () => {
        const active = document.getElementById('live');
        this.scrollContainer.scrollLeft = active.offsetLeft - (this.scrollContainer.offsetWidth / 2) + (active.offsetWidth / 2);
    }


    componentDidUpdate(prevProps) {
        if (prevProps.epg !== this.props.epg) {
            setTimeout(() => {
                this.setArrs();
                if (this.state.scrollToActiveOnLoad) {
                    this.scrollToActive();
                }
            }, 500);
        }
    }

    setArrs = () => {
        let diff = 0;
        if (!this.state.isTouch) {
            diff = this.itemsContainer.offsetWidth - this.scrollContainer.offsetWidth;
        }
        let scroll = this.scrollContainer.scrollLeft;
        this.setState({
            allowArrs: diff > 0,
            leftArr: !(scroll <= 0),
            rightArr: !(scroll >= diff),
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
        // clearInterval(this.interval);
        if (arrow === 'l') {
            this.left();
        } else {
            this.right();
        }
        this.setArrs();
    }
    componentWillUnmount() {
        if (this.interval) clearInterval(this.interval);
    }

    render() {
        const { gridClassName, currentProgramId } = this.props;
        const { isTouch, leftArr, rightArr, allowArrs } = this.state;
        const isTouchClassName = isTouch ? 'touch' : '';
        const now = Date.now();

        return (
            <div className="carousel carousel-epg usn ">
                <div className="carousel-wrapper">
                    <div className={'carousel-inner ' + isTouchClassName} ref={el => this.scrollContainer = el} key="0" onScroll={this.setArrs} onWheel={this.setArrs}>
                        <div className={'carousel-items ' + gridClassName} ref={el => this.itemsContainer = el} style={{ 'display': 'inline-block' }}>
                            {map(this.props.epg, (day, ts) => {
                                const dayMoment = moment.unix(ts / 1000);
                                return (
                                    <div className="channels-epg-day" key={ts}>
                                        <div className="channels-epg-title">
                                            <div className="channels-epg-title--date">{dayMoment.format('DD MMM')}</div>
                                            <div className="channels-epg-title--day">{dayMoment.format('dd')}</div>
                                        </div>
                                        {map(day, (program, index) => {
                                            const hasRecordClassName = (program.dvr === 1 || (program.dvr === -1 && program.stop < now)) ? 'dvr' : '';
                                            const isLiveClassName = program.id === currentProgramId ? 'live' : '';
                                            return (
                                                <div className={'channels-epg-item ' + isLiveClassName + ' ' + hasRecordClassName} key={index} id ={isLiveClassName}>
                                                    <div className="channels-epg-item--top">
                                                        {program.startTime}
                                                        <div className="marker"/>
                                                    </div>
                                                    <div className="channels-epg-item--bottom">{program.title}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {!isTouch && allowArrs ?
                        <div className="carousel-arrows">
                            {leftArr ? <div className="carousel-arrow left" onClick={() => this._handleArrowClick('l')}/> : null}
                            {rightArr ? <div className="carousel-arrow right" onClick={() => this._handleArrowClick('r')}/> : null}
                        </div> : null
                    }
                </div>
            </div>
        );
    }
}
