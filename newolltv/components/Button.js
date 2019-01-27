import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Button extends Component {
    _handleMouseEnter = (event) => {
        const { width, height, left, top } = this.button.getBoundingClientRect();
        const relX = event.pageX - left,
            relY = event.pageY - top - document.body.scrollTop;

        const percentageX = ((relX / width).toFixed(2) * 100),
            percentageY = ((relY / height).toFixed(2) * 100);
        let gradientColor = '';

        if (Object.values(this.button.classList).indexOf('primary') !== -1) {
            gradientColor = '#22aaff';
        } else if (Object.values(this.button.classList).indexOf('default') !== -1) {
            gradientColor = 'rgba(110, 110, 110, 0.4)';
        } else if (Object.values(this.button.classList).indexOf('not-transparent') !== -1) {
            gradientColor = 'rgba(110, 110, 110, 0.8)';
        }

        this.button.style.backgroundImage = `radial-gradient(circle closest-corner at ${percentageX}% ${percentageY}%, ${gradientColor}, transparent)`;
    }
    _handleMouseOut = () => {
        this.button.style = {};
    }
    render() {
        const { title, isSmall, isPrimary, isDefault, isLarge, isFluid, isLoading, withIcon, customClassName, isDisabled, notTransparent } = this.props;
        let className = 'btn';
        className += isSmall ? ' small' : '';
        className += isLarge ? ' large' : '';
        className += isLoading ? ' loading' : '';
        className += isFluid ? ' fluid' : '';
        className += isDefault ? ' default' : '';
        className += notTransparent ? ' not-transparent' : '';
        className += withIcon ? ' with-icon' : '';
        className += isPrimary ? ' primary' : '';
        className += customClassName ? ' ' + customClassName : '';
        className += isDisabled ? ' disabled' : '';

        return (
            <div
                className={className}
                onClick={isDisabled ? null : this.props.onClick}
                onMouseMove={isDisabled ? null : this._handleMouseEnter}
                onMouseOut={isDisabled ? null : this._handleMouseOut}
                ref={el => this.button = el}
            >{title}</div>
        );
    }
}

Button.propTypes = {
    title: PropTypes.string,
    isSmall: PropTypes.bool,
    isFluid: PropTypes.bool,
    isLarge: PropTypes.bool,
    isPrimary: PropTypes.bool,
    isDefault: PropTypes.bool,
    notTransparent: PropTypes.bool,
    isLoading: PropTypes.bool,
    withIcon: PropTypes.bool,
    customClassName: PropTypes.string,
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
};
