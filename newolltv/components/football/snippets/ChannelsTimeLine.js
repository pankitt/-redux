import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import map from 'lodash/map';
import filter from 'lodash/filter';
import Progress from '../Progress';
import { Link } from 'react-router-dom';
import forEach from 'lodash/forEach';

class ChannelsTimeLine extends Component {
    static propTypes = {
        channels: PropTypes.object,
        epg: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            intervalTime: 10,
            duration: 200,
            isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
        };
        this.step = 20;
        this.K = 5;
    }
    setArrs() {
        return;
    }

    left = () => {
        const { channels } = this.props;
        return this.animate((to) => {
            forEach(channels, (channel, i) => this['scrollContainer' + i].scrollLeft = this['scrollContainer' + i].scrollLeft - to);
        }, () => this.setArrs());
    }

    right= () => {
        const { channels } = this.props;
        return this.animate((to) => {
            forEach(channels, (channel, i) => this['scrollContainer' + i].scrollLeft = this['scrollContainer' + i].scrollLeft + to);
        }, () => this.setArrs());
    }

    animate = (todo, finish) => {
        clearInterval(this.interval);
        const ease = (t, b, c, d) => -c * ((t = t / d - 1) * t * t * t - 1) + b;
        let ct = 0;
        this.interval = setInterval(() => {
            ct += this.K;
            if (ct > this.state.duration) {
                clearInterval(this.interval);
                finish();
            } else {
                todo(ease(ct, 0, 10, this.state.duration));
            }
        }, this.K);
    }

    _handleArrowClick = (arrow) => {
        clearInterval(this.interval);
        if (arrow === 'l') {
            this.left();
        } else {
            this.right();
        }
    }
    render() {
        const { channels, epg } = this.props;
        const now = Date.now();
        return (
            <div className="channels-timeline usn">
                {map(channels, (channel, i) => {
                    const currentProgramId = channel.currentProgramId;
                    const filteredEpg = filter(channel.epg, item => {
                        return epg[item].stop > now;
                    });
                    return (
                        <Link className="channel" key={i}  to={'/channels/' + i}>
                            <div className={'logo channel-' + i}></div>
                            <div ref={el => this['scrollContainer' + i]  = el} className="scroll-container" key="a">
                                <ul className="timeline" ref={el => this.itemsContainer = el}>
                                    {map(filteredEpg, item => {
                                        const program = epg[item];
                                        let marker;
                                        if (program.id === currentProgramId) {
                                            marker = <div className="marker"></div>;
                                        }
                                        const activeClassName = program.id === currentProgramId ? 'active' : '';
                                        return (
                                            <li className={'timeline-item ' + activeClassName} key={item} title={program.title}>
                                                {marker}
                                                <div className="time">{program.startTime}</div>
                                                <div className="title">{program.title}</div>
                                                {program.start < now && now < program.stop ? <Progress {...program} key={item}/> : null}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </Link>
                    );
                })}
                {!this.state.isTouch ? <div className="carousel-arrows">
                    <div className="carousel-arrow left" onMouseDown={() => this._handleArrowClick('l')} onMouseUp={() => clearInterval(this.scroll)}/>
                    <div className="carousel-arrow right" onMouseDown={() => this._handleArrowClick('r')} onMouseUp={() => clearInterval(this.scroll)}/>
                </div> : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        channels: state.channels,
        epg: state.epg,
    };
};

export default connect(mapStateToProps)(ChannelsTimeLine);
