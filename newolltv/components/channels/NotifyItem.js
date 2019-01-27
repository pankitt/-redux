import React, { Component } from 'react';
import map from 'lodash/map';

export default class NotifyItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timers: [
                {
                    duration: 15,
                    value: '15 мин',
                },
                {
                    duration: 30,
                    value: '30 мин',
                },
                {
                    duration: 60,
                    value: 'Час',
                },
                {
                    duration: null,
                    value: 'Выкл',
                },
            ],
            isOpen: false,
            active: null,
        };
    }

    handleIconClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    setTimer = (timer) => {
        this.setState({ active: timer, isOpen: false });
        // улетает запрос куда-то в апи
    }

    render() {
        const { timers, active } = this.state;
        const isOpenClassName = this.state.isOpen ? 'open' : '';
        const isActiveTimer = active ? ' active ' : '';
        return (
            <div>
                <div className={'notify ' + isOpenClassName}>
                    <div className="vac">
                        <p>Напомнить за:</p>
                        <ul>
                            {map(timers, (timer, i) => {
                                const activeClassName = timer.duration === active ? 'active' : '';
                                return (
                                    <li key={i} className={activeClassName} onClick={() => this.setTimer(timer.duration)}>{timer.value}</li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className={'notify-btn ' + isActiveTimer} onClick={this.handleIconClick}></div>
            </div>
        );
    }
}
