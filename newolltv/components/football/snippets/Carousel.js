import React, { Component } from 'react';
import map from 'lodash/map';
import PropTypes from 'prop-types';

export default class Carousel extends Component {
    static propTypes = {
        ids: PropTypes.array.isRequired,
        entities: PropTypes.object.isRequired,
        active: PropTypes.number.isRequired,
        customClassName: PropTypes.string.isRequired,
        setActive: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.timeout = null;
        this.state = {
            active: props.active,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ active: nextProps.active });
    }

    pushActiveToStore() {
        if (typeof this.props.setActive !== 'function') {
            return;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => this.state.active !== this.props.active && this.props.setActive(this.state.active), 500);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.active !== nextState.active) {
            this.pushActiveToStore();
        }
        return nextProps.active !== this.props.active || nextState.active !== this.state.active;
    }

    scroll(direction = 0) {
        const ids = this.props.ids;
        let nextActiveIndex = ids.indexOf(this.state.active) + direction;
        if (nextActiveIndex !== -1 && nextActiveIndex < ids.length) {
            this.setState({ active: ids[nextActiveIndex] });
        }
    }

    render() {
        const { entities, ids, customClassName } = this.props;
        const active = this.state.active;
        return (
            <div className={'carousel ' + customClassName }>
                <div className="carousel-inner">
                    { map(ids, id => {
                        const item = entities[id];
                        const className =  id === active ? 'carousel-item  focus' : 'carousel-item';
                        return (
                            <div key={id} className={className}>
                                <img src={ item.logo } alt=""/>
                            </div>
                        );
                    }) }
                </div>
            </div>
        );
    }
}