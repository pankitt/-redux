import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spring, animated  } from 'react-spring';

export default class SideBar extends Component {
    static propTypes = {
        children: PropTypes.node,
        right: PropTypes.bool,
        isOpen: PropTypes.bool,
        width: PropTypes.number,
        customClassName: PropTypes.string,
        onClose: PropTypes.func,
    }

    handleCloseButtonClick =() => {
        this.props.onClose();
    }

    render() {
        const { customClassName, children, right, isOpen } = this.props;

        const className = 'sidebar ' + (right ? 'sidebar-right' : 'sidebar-left') + (customClassName ? ' ' + customClassName : '');

        // const isOpenClassName = isOpen ? 'open' : '';
        const from = right ? 100 : -100;
        const to = isOpen ? 0 : from;
        // const config = { tension: 160, friction: 25 };
        return (
            <Spring from={{ x : from }} to={{ x: to }} native>
                {({ x }) => <animated.div
                    style={{ transform: x.interpolate(x => `translateX(${x}%)`) }}
                    className={className}
                >
                    <div className="close-btn" onClick={this.handleCloseButtonClick} />
                    {children}
                </animated.div>}
            </Spring>

        );
    }
}
