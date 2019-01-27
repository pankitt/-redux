import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Input extends Component {
    static propTypes = {
        type: PropTypes.string,
        error: PropTypes.string,
        label: PropTypes.string,
        customClassName: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        isOnFocus: PropTypes.bool,
    };

    componentDidUpdate(prevProps) {
        if (prevProps.isOnFocus !== this.props.isOnFocus && this.props.isOnFocus) {
            this.input.focus();
        }
    }

    render() {
        const { error, customClassName, type = 'text', placeholder = '', label } = this.props;
        const withErrorClassName = error ? 'error' : '';
        return (
            <div className={'input-block  ' + withErrorClassName + ' ' + customClassName}>
                {label ? <div className="label">{label}</div> : null}
                <input type={type} placeholder={placeholder} onChange={this.props.onChange} ref={el => this.input = el}/>
                {error ? <div className="error">{error}</div> : null}
            </div>
        );
    }
}
